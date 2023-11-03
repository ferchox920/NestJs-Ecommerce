import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderStatus } from 'src/utility/commons/order-status.enum';
import dataSource from 'db/data-source';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoriesService,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
  ) {}
  async create(
    createProductDto: CreateProductDto,
    currentUser: UserEntity,
  ): Promise<ProductEntity> {
    const category = await this.categoryService.findOne(
      createProductDto.categoryId,
    );
    const product = this.productRepository.create(createProductDto);
    product.category = category;
    product.addedBy = currentUser;

    return await this.productRepository.save(product);
  }

  async findAll(
    query: any,
  ): Promise<any> {
    let filteredTotalProducts: number;
    let limit: number;
    if (!query.limit) {
      limit = 4;
    } else {
      limit = query.limit;
    }

    const queryBuilder = dataSource
      .getRepository(ProductEntity)
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoin('product.reviews', 'reviews')
      .addSelect([
        'COUNT(reviews.id) as reviewsCount',
        'AVG(reviews.ratings)::numeric(10,2)  as avgRating',
      ])
      .groupBy('product.id,category.id');

    const totalProducts = await queryBuilder.getCount();
    if (query.search) {
      const search = query.search;
      queryBuilder.andWhere('product.title LIKE :title', {
        title: `%${search}%`,
      });
    }
    if (query.category) {
      const category = query.category;
      queryBuilder.andWhere('category.id = :id', {
        id: category,
      });
    }
    if (query.minPrice) {
      const minPrice = query.minPrice;
      queryBuilder.andWhere('product.price >= :minPrice', {
        minPrice: minPrice,
      });
    }
    if (query.maxPrice) {
      const maxPrice = query.maxPrice;
      queryBuilder.andWhere('product.price <= :maxPrice', {
        maxPrice: maxPrice,
      });
    }
    if (query.minRating) {
      const minRating = query.minRating;
      queryBuilder.andWhere('AVG(reviews.ratings) >= :minRating', {
        minRating: minRating,
      });
    }
    if (query.maxRating) {
      const maxRating = query.maxRating;
      queryBuilder.andWhere('AVG(reviews.ratings) <= :maxRating', {
        maxRating: maxRating,
      });
    }
    if (query.offset) {
      const offset = query.offset;
      queryBuilder.offset(offset);
    }
    queryBuilder.limit(limit);
    const products = await queryBuilder.getRawMany();
    return { products: products, totalProducts, limit };
  }
  async findOne(id: string): Promise<ProductEntity> {
    const product = await this.findProduct(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(
    id: string,
    updateProductDto: Partial<UpdateProductDto>,
    currentUser: UserEntity,
  ): Promise<ProductEntity> {
    const existingProduct = await this.findProduct(id);
    if (!existingProduct) throw new NotFoundException('Product not found');
    Object.assign(existingProduct, updateProductDto);
    existingProduct.addedBy = currentUser;
    if (updateProductDto.categoryId) {
      const category = await this.categoryService.findOne(
        updateProductDto.categoryId,
      );
      existingProduct.category = category;
    }
    return await this.productRepository.save(existingProduct);
  }

  async remove(id: string):Promise<ProductEntity> {
    const product = await this.findOne(id);
    const order = await this.ordersService.findByProductId(product.id);
    if (order) {
      throw new BadRequestException(
        'Product is in an order, cannot be deleted',
      );
    }

    return await this.productRepository.remove(product);
  }

  private async findProduct(id: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: {
        id: id,
      },
      relations: { addedBy: true, category: true },
      select: {
        addedBy: { id: true, name: true, email: true },
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async updateStock(id: string, stock: number, status: OrderStatus) {
    let product = await this.findOne(id);
    if (status === OrderStatus.DELIVERED) {
      product.stock -= stock;
      await this.productRepository.save(product);
    } else {
      product.stock += stock;
    }
    product = await this.productRepository.save(product);
    return product;
  }
}
