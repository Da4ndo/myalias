import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Dev } from '../src/dev/dev.entity';
import { User } from '../src/user/user.entity';
import { HttpStatus } from '@nestjs/common'; // Assuming you're using NestJS HttpStatus
import * as yargs from 'yargs';

const result = config({ path: '.env' });

if (result.error) {
  throw result.error;
}

let argv = yargs
  .option('username', {
    alias: 'u',
    description: 'Username',
    type: 'string',
  })
  .option('email', {
    alias: 'e',
    description: 'Email',
    type: 'string',
  })
  .help()
  .alias('help', 'h').argv;

async function create(
  devRepository,
  userRepository,
  username: string,
  email: string,
) {
  const existingDev = await devRepository.findOne({ where: { username } });

  if (existingDev) {
    console.log('Dev already exists');
    return { status: HttpStatus.BAD_REQUEST, message: 'Dev already exists' };
  }

  console.log(await userRepository.find());
  const user = await userRepository.findOne({ where: { email } });

  if (!user) {
    console.log('User not found');
    return { status: HttpStatus.NOT_FOUND, message: 'User not found' };
  }

  user.accepted = true;
  await userRepository.save(user);

  console.log('User accepted successfully');

  const newDev = devRepository.create({
    username,
    email,
  });

  await devRepository.save(newDev);

  console.log('Dev created successfully');
  return {
    status: HttpStatus.CREATED,
    message: 'Dev created successfully',
    dev: newDev,
  };
}

(async () => {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: 3306,
    username: 'mailuser',
    password: process.env.DATABASE_USER_PASSWORD,
    database: 'mailserver',
    entities: [Dev, User],
    synchronize: true,
    dropSchema: false,
    logging: true,
  });

  const connection = await dataSource.initialize();

  const devRepository = connection.getRepository(Dev);
  const userRepository = connection.getRepository(User);

  if (typeof argv.then === 'function') {
    argv = await argv;
  }

  if (!(argv as any).username || !(argv as any).email) {
    console.log('Username or email is empty');
    return;
  }

  console.log(`Username: ${(argv as any).username}`);
  console.log(`Email: ${(argv as any).email}`);

  const result = await create(
    devRepository,
    userRepository,
    (argv as any).username,
    (argv as any).email,
  );

  console.log(result);
})();
