import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { favorites } from '@prisma/client';

@Controller('blogs/:id/favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}


  @Post()
  async create(@Param('id') id: string, @Body() createFavoriteDto: any) {
    // @ts-ignore
    createFavoriteDto.blog_id = id;

    const favs = await this.favoritesService.create(createFavoriteDto);

    return favs;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.favoritesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFavoriteDto: favorites) {
    return this.favoritesService.update(id, updateFavoriteDto);
  }

  @Delete(':email')
  remove(@Param('id') id: string, @Param('email') email: string) {
    return this.favoritesService.remove(id, email);

  }
}
