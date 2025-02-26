import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto) {
    return this.wishlistService.create(createWishlistDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.wishlistService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishlistService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistService.update(+id, updateWishlistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishlistService.remove(+id);
  }
}
