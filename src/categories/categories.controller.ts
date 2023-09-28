import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthentificationGuard } from 'src/utility/guards/authentification.guard';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { Roles } from 'src/utility/commons/roles-enum';
import { CategoryEntity } from './entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @UseGuards(AuthentificationGuard,AuthorizeGuard([Roles.ADMIN]))
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto, @CurrentUser() currentUser:UserEntity): Promise<CategoryEntity> {
    return await this.categoriesService.create(createCategoryDto,currentUser);
  }

  @Get()
  async findAll():Promise<CategoryEntity[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string):Promise<CategoryEntity> {
    return this.categoriesService.findOne(id);
  }

  @UseGuards(AuthentificationGuard,AuthorizeGuard([Roles.ADMIN]))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto):Promise<CategoryEntity> {
    return await this.categoriesService.update(id, updateCategoryDto);
  }
  
  @UseGuards(AuthentificationGuard,AuthorizeGuard([Roles.ADMIN]))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
