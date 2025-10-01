import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('calculate')
@Controller('calculate')
export class CalculateController {
  @Post()
  @ApiOperation({ summary: 'Calculate LCA results' })
  async calculate(@Body() calculateDto: any) {
    return { message: 'Calculate endpoint - to be implemented' };
  }
}

