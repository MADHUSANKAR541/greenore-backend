import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('optimize')
@Controller('optimize')
export class OptimizeController {
  @Post()
  @ApiOperation({ summary: 'Optimize scenario parameters' })
  async optimize(@Body() optimizeDto: any) {
    return { message: 'Optimize endpoint - to be implemented' };
  }
}

