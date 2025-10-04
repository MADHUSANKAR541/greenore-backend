import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('optimize')
@Controller('optimize')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OptimizeController {
  @Post()
  @ApiOperation({ summary: 'Optimize scenario parameters' })
  async optimize(@Body() optimizeDto: any) {
    return { message: 'Optimize endpoint - to be implemented' };
  }
}

