import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignUp } from './dto/user-signup.dto';
import { UserSignIn } from './dto/user-signin.dto';
import { sign } from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  // async create(createUserDto: CreateUserDto): Promise<UserEntity> {
  //   const { email, password } = createUserDto;

  //   const userExisting = await this.findOneByEmail(email);

  //   if (userExisting) {
  //     throw new BadRequestException('User already exists');
  //   }
  //   const hashedPassword = await bcrypt.hash(password, 10);

  //   const newUser = this.userRepository.create({
  //     ...createUserDto,
  //     password: hashedPassword,
  //   });

  //   return await this.userRepository.save(newUser);
  // }

  async signUp(userSignIn: UserSignIn): Promise<UserEntity> {
    const { email, password } = userSignIn;

    const userExisting = await this.findOneByEmail(email);

    if (userExisting) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      ...userSignIn,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);
    delete savedUser.password;
    return savedUser;
  }

  async signIn(userSignIn: UserSignIn): Promise<UserEntity> {
    const { email, password } = userSignIn;

    const userExisting = await this.userRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email = :email', { email })
      .getOne();

    if (!userExisting) {
      throw new BadRequestException('User does not exist');
    }

    const matchPassword = await bcrypt.compare(password, userExisting.password);

    if (!matchPassword) {
      throw new BadRequestException('Invalid credentials');
    }

    // Elimina la contraseña antes de devolver el usuario
    delete userExisting.password;

    return userExisting;
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async accessToken(user: UserEntity): Promise<string> {
    return sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRATION_TIME },
    );
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOneById(id: string): Promise<UserEntity | undefined> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
