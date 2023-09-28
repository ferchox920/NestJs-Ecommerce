import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignUp } from './dto/user-signup.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignIn } from './dto/user-signin.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { AuthentificationGuard } from 'src/utility/guards/authentification.guard';
import { Roles } from 'src/utility/commons/roles-enum';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Post()
  // async create(@Body() createUserDto: CreateUserDto) {
  //   return await this.usersService.create(createUserDto);
  // }

  @Post('/signup')
  async signUp(@Body() userSignUp: UserSignUp): Promise<{ user: UserEntity }> {
    return { user: await this.usersService.signUp(userSignUp) };
  }

  @Post('/signin')
  async signIn(
    @Body() userSignIn: UserSignIn,
  ): Promise<{ accessToken: string; user: UserEntity }> {
    const user = await this.usersService.signIn(userSignIn);
    const accessToken = await this.usersService.accessToken(user);
    return { accessToken, user };
  }


  @UseGuards(AuthentificationGuard, AuthorizeGuard([Roles.ADMIN]))
  @Get('/all')
  async findAll(): Promise<UserEntity[]>{
    return await this.usersService.findAll();
  }

  @Get('single/:id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @UseGuards(AuthentificationGuard)
  @Get('me')
  getProfile(@CurrentUser()  currentUser: UserEntity) {
    return currentUser
  }
}
