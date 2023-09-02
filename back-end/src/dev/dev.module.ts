import { Module } from '@nestjs/common';
import { DevService } from './dev.service';
import { DevController } from './dev.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AliasModule } from '../alias/alias.module';
import { Dev } from './dev.entity';

@Module({
  imports: [
    UserModule,
    AliasModule,
    TypeOrmModule.forFeature([Dev])
  ],
  providers: [DevService],
  controllers: [DevController]
})
export class DevModule {}
