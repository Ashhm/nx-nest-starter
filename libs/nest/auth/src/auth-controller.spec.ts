import { INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { FixtureHelperFactory, SpecHelperFactory } from '@libs/nest/test';
import { UserFixtureHelper, UserSpecHelper } from '@libs/nest/test/user';
import { AuthSpecHelper } from '../test/helpers';
import { AuthModule } from './auth.module';
import { AccessTokenGuard } from './guards';

describe('AuthController', () => {
  let app: INestApplication;
  const fixtureHelper = FixtureHelperFactory.create(UserFixtureHelper);
  const specHelper = SpecHelperFactory.create(UserSpecHelper, AuthSpecHelper).useFixtureHelper(fixtureHelper);

  beforeAll(async () => {
    app = await specHelper.createApp({
      imports: [AuthModule],
      providers: [
        {
          provide: APP_GUARD,
          useClass: AccessTokenGuard,
        },
      ],
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    const context = specHelper.withUser();
    specHelper.clearAll(context);

    it('should return access and refresh tokens', async () => {
      await specHelper.httpClient
        .post('/auth/login')
        .send({ username: context.user.username, password: context.user.password })
        .expect(201)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.accessToken).toBeDefined();
          expect(body.refreshToken).toBeDefined();
          expect(body.expiresIn).toBeDefined();
          expect(body.type).toBe('Bearer');
        });
    });

    it('should throw error if user does not exist', async () => {
      await specHelper.httpClient
        .post('/auth/login')
        .send({ username: 'not-existing-user', password: 'password' })
        .expect(401)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.message).toEqual('Unauthorized');
        });
    });

    it('should throw error if password is incorrect', async () => {
      await specHelper.httpClient
        .post('/auth/login')
        .send({ username: context.user.username, password: 'incorrect-password' })
        .expect(401)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.message).toEqual('Unauthorized');
        });
    });

    it('should throw error if username is invalid', async () => {
      await specHelper.httpClient
        .post('/auth/login')
        .send({ username: 'invalid', password: 'password' })
        .expect(401)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.message).toEqual('Unauthorized');
        });
    });
  });

  describe('POST /auth/refresh-token', () => {
    const context = specHelper.withUser();
    specHelper.clearAll(context);

    it('should return access and refresh tokens', async () => {
      const { body } = await specHelper.httpClient
        .post('/auth/login')
        .send({ username: context.user.username, password: context.user.password });

      await specHelper.httpClient
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${body.refreshToken}`)
        .send()
        .expect(201)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.accessToken).toBeDefined();
          expect(body.refreshToken).toBeDefined();
          expect(body.expiresIn).toBeDefined();
          expect(body.type).toBe('Bearer');
        });
    });

    it('should create individual refresh tokens per device fingerprint', async () => {
      const { body: body1 } = await specHelper.httpClient
        .post('/auth/login')
        .set('User-Agent', 'device1')
        .send({ username: context.user.username, password: context.user.password });
      const { body: body2 } = await specHelper.httpClient
        .post('/auth/login')
        .set('User-Agent', 'device2')
        .send({ username: context.user.username, password: context.user.password });

      await Promise.all(
        [body1, body2].map(async (body) => {
          await specHelper.httpClient
            .post('/auth/refresh')
            .set('Authorization', `Bearer ${body.refreshToken}`)
            .send()
            .expect(201)
            .expect(({ body }) => {
              expect(body).toBeDefined();
              expect(body.accessToken).toBeDefined();
              expect(body.refreshToken).toBeDefined();
              expect(body.expiresIn).toBeDefined();
              expect(body.type).toBe('Bearer');
            });
        }),
      );
    });

    it('should throw error if refresh token is invalid', async () => {
      await specHelper.httpClient
        .post('/auth/refresh')
        .set('Authorization', `Bearer invalid`)
        .send()
        .expect(401)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.message).toEqual('Unauthorized');
        });
    });

    it('should throw error if refresh token is not found', async () => {
      const { body } = await specHelper.httpClient
        .post('/auth/login')
        .send({ username: context.user.username, password: context.user.password });

      await specHelper.clearRefreshTokens(context.user.id);

      await specHelper.httpClient
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${body.refreshToken}`)
        .send()
        .expect(403)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.message).toEqual('Forbidden');
        });
    });
  });

  describe('GET /auth/logout', () => {
    const context = specHelper.withUser();
    specHelper.clearAll(context);

    it('should logout user from current device', async () => {
      const { body } = await specHelper.httpClient
        .post('/auth/login')
        .send({ username: context.user.username, password: context.user.password });

      await specHelper.httpClient
        .get('/auth/logout')
        .set('Authorization', `Bearer ${body.accessToken}`)
        .send()
        .expect(200);

      await specHelper.httpClient
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${body.refreshToken}`)
        .send()
        .expect(403)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.message).toEqual('Forbidden');
        });
    });
  });

  describe('GET /auth/logout-all', () => {
    const context = specHelper.withUser();
    specHelper.clearAll(context);

    it('should logout user from all devices', async () => {
      const { body } = await specHelper.httpClient
        .post('/auth/login')
        .send({ username: context.user.username, password: context.user.password });

      await specHelper.httpClient
        .get('/auth/logout-all')
        .set('Authorization', `Bearer ${body.accessToken}`)
        .send()
        .expect(200);

      await specHelper.httpClient
        .post('/auth/refresh')
        .set('Authorization', `Bearer ${body.refreshToken}`)
        .send()
        .expect(403)
        .expect(({ body }) => {
          expect(body).toBeDefined();
          expect(body.message).toEqual('Forbidden');
        });
    });
  });
});
