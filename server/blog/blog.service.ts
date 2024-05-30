import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { blog } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(readonly prisma: PrismaService) {}
  create(createBlogDto:blog
  ) {
    return this.prisma.blog.create({
      data: createBlogDto,
    });

  }


  /**
   *
   */
  findAll() {
    return this.prisma.blog.findMany();
  }

  /**
   *
   * @param id
   */
  findOne(id: string) {
    return this.prisma.blog.findUnique({
      where: { id },
    });

  }

  /**
   *
   * @param id
   * @param updateBlogDto
   */
  update(id: string, updateBlogDto: blog) {
    return this.prisma.blog.update({
      where: { id },
      data: updateBlogDto,
    });

  }

  /**
   *
   * @param id
   */
  remove(id: string) {
    return this.prisma.blog.delete({
      where: { id },
    });
    };

}
