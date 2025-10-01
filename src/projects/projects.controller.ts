import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  async findAll() {
    return { message: 'Projects endpoint - to be implemented' };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  async create(@Body() createProjectDto: any) {
    return { message: 'Create project - to be implemented' };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  async findOne(@Param('id') id: string) {
    return { message: `Get project ${id} - to be implemented` };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update project' })
  async update(@Param('id') id: string, @Body() updateProjectDto: any) {
    return { message: `Update project ${id} - to be implemented` };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project' })
  async remove(@Param('id') id: string) {
    return { message: `Delete project ${id} - to be implemented` };
  }
}

