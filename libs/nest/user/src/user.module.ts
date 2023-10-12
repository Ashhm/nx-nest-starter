import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from './configs';
import { UserController } from './user.controller';
import { userModelDefinition } from './user.schema';
import { UserService } from './user.service';

@Module({
  imports: [AppConfigModule, MongooseModule.forFeature([userModelDefinition])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
