import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AliasModule } from './alias/alias.module';
import { DevModule } from './dev/dev.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    TypeOrmModule.forRoot(
      process.env.NODE_ENV === 'production'
        ? {
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: 3306,
            username: 'mailuser',
            password: process.env.DATABASE_USER_PASSWORD,
            database: 'mailserver',
            entities: [__dirname + '/**/*.entity.{js,ts}'],
            synchronize: true,
            dropSchema: false,
            logging: true,
          }
        : {
            type: 'sqlite',
            database: ':memory:',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: true,
            dropSchema: true, // This will clear the in-memory database every time the application restarts
          },
    ),
    AuthModule,
    UserModule,
    AliasModule,
    DevModule,
  ],
})
export class AppModule {}
