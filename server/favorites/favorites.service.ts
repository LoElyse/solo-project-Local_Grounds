import { ConflictException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { favorites } from '@prisma/client';

@Injectable()
export class FavoritesService {
  constructor(readonly prisma: PrismaService) {}
  async create(createFavoriteDto: favorites) {
    try {
      await this.prisma.favorites.create({
        data: createFavoriteDto,
      });

      return await this.findBlogByEmail(createFavoriteDto.blog_id, createFavoriteDto.email);

     // return await this.findAllByEmail(createFavoriteDto.email);
    } catch (error) {
      return new ConflictException(error.message, { cause: 'conflict', description: error.message });
    }
  }

  /**
   * Find all favorites
   */
  async findAllByEmail(email: string) {
    let blogs = await this.prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        place: true,
        favorites: {
          where: {
            email: email
          },
        }
      },
    });

    for(const blog of blogs){
      blog['favorite'] = blog.favorites.length > 0;
    }

    return blogs.filter(blog => blog['favorite']);

  }


  async findBlogByEmail(blogId: string, email: string) {
    let blog = await this.prisma.blog.findUnique({
      where: {
        id: blogId
      },
      select: {
        id: true,
        title: true,
        content: true,
        place: true,
        favorites: {
          where: {
            email: email
          },
        }
      },
    });

    blog['favorite'] = blog.favorites.length > 0;

    return blog;
  }

  /**
   * Find a favorite by id
   * @param id
   */
  findOne(id: string) {
    return this.prisma.favorites.findUnique({
      where: { id },
    });
  }


  /**
   *
   * @param id
   * @param updateFavoriteDto
   */
  update(id: string, updateFavoriteDto: favorites ) {
    return this.prisma.favorites.update({
      where: { id },
      data: updateFavoriteDto,
    });
  }

  /**
   *
   * @param id
   * @param email
   */
  async remove(id:string, email: string) {
    try{
      await this.prisma.favorites.delete({
        where: {
          blogAndEmail: {
            blog_id: id,
            email: email
          }
        }
      });

      return await this.findBlogByEmail(id, email);


    }
    catch(error){
      return new UnprocessableEntityException(error.message, { cause: 'unprocessable', description: error.message });
    }

   // return await this.findAllByEmail(email);
  };
}
