import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PasswordService } from './password/password.service';

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService, PasswordService],
})
export class AppModule {}
