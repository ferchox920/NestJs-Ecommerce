import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from './entities/review.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private reviewRepository: Repository<ReviewEntity>,
    private productService: ProductsService,
  ) {}
  async create(
    createReviewDto: CreateReviewDto,
    currentUser: UserEntity,
  ): Promise<ReviewEntity> {
    const product = await this.productService.findOne(
      createReviewDto.productId,
    );

    let review = await this.findOneByUserAndProduct(
      currentUser.id,
      createReviewDto.productId,
    );
    if (!review) {
      review = this.reviewRepository.create(createReviewDto);
      review.user = currentUser;
      review.product = product;
    } else {
      review.comment = createReviewDto.comment;
      review.ratings = createReviewDto.ratings;
    }
    return this.reviewRepository.save(review);
  }

  async findAll() {
    return await this.reviewRepository.find()
  }

  async findAllByProduct(id: string) {
    const product = await this.productService.findOne(id);

    return await this.reviewRepository.find({
      where: {
        product: { id },
      },
      relations: { user: true, product: { category: true } },
    });
  }

  async findOne(id: string): Promise<ReviewEntity> {
    console.log(id);
    
    const review = this.reviewRepository.findOne({
      where: { id: id },
      relations: { user: true, product: { category: true } },
    });
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  async remove(id: string) {
    try {
      const review = await this.findOne(id);

      if (!review) {
        throw new NotFoundException('Review not found');
      }

      await this.reviewRepository.remove(review);

      return { message: `Review with id ${id} has been successfully removed.` };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to remove the review.');
    }
  }

  private async findOneByUserAndProduct(
    userId: string,
    productId: string,
  ): Promise<ReviewEntity> {
    return await this.reviewRepository.findOne({
      where: {
        user: { id: userId },
        product: { id: productId },
      },
      relations: { user: true, product: { category: true } },
    });
  }
}
