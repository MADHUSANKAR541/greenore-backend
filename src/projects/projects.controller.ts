import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto, Project } from './projects.service';

@ApiTags('projects')
@Controller('projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'List of projects' })
  async findAll(): Promise<Project[]> {
    return this.projectsService.getAllProjects();
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

