import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('estimate')
@Controller('estimate')
export class EstimateController {
  @Post()
  @ApiOperation({ summary: 'Estimate LCA parameters' })
  async estimate(@Body() estimateDto: any) {
    return { message: 'Estimate endpoint - to be implemented' };
  }
}

