import { Module } from '@nestjs/common';
import { AliasController } from './alias.controller';
import { AliasService } from './alias.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alias } from './alias.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Alias])
  ],
  controllers: [AliasController],
  providers: [AliasService],
  exports: [AliasService]
})
export class AliasModule {}
