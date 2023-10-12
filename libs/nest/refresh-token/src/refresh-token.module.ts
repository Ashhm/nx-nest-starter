import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { refreshTokenModelDefinition } from './refresh-token.schema';
import { RefreshTokenService } from './refresh-token.service';

@Module({
  imports: [MongooseModule.forFeature([refreshTokenModelDefinition])],
  controllers: [],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
