import { Controller, Get, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Fingerprint, IFingerprint } from 'nestjs-fingerprint';
import { Public } from '@libs/nest/shared/decorators';
import { ClassSerializerInterceptor } from '@libs/nest/shared/interceptors';
import { AuthRequest } from '@libs/nest/shared/interfaces';
import { LoginRequestDto, LoginResponseDto } from '@libs/shared/dtos';
import { DtoFactory } from '@libs/shared/factories';
import { AuthService } from './auth.service';
import { PasswordGuard, RefreshTokenGuard } from './guards';

@Controller('auth')
@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(PasswordGuard)
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({ type: LoginResponseDto })
  @Post('login')
  public async login(@Request() req: AuthRequest, @Fingerprint() fingerprint: IFingerprint) {
    const authResult = await this.authService.login(req.user, fingerprint.id);
    return DtoFactory.create(LoginResponseDto, authResult);
  }

  @Get('logout')
  public async logout(@Request() req: AuthRequest, @Fingerprint() fingerprint: IFingerprint) {
    await this.authService.logout(req.user.id, fingerprint.id);
  }

  @Get('logout-all')
  public async logoutAll(@Request() req: AuthRequest) {
    await this.authService.logout(req.user.id);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @ApiResponse({ type: LoginResponseDto })
  public async refreshTokens(@Request() req: AuthRequest, @Fingerprint() fingerprint: IFingerprint) {
    const authResult = await this.authService.login(req.user, fingerprint.id);
    return DtoFactory.create(LoginResponseDto, authResult);
  }
}
