import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived' | 'draft';
  owner: string;
  scenarios: string[];
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any>;
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  owner: string;
  metadata?: Record<string, any>;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  status?: 'active' | 'completed' | 'archived' | 'draft';
  metadata?: Record<string, any>;
}

@Injectable()
export class ProjectsService {
  private projects: Project[] = [
    {
      id: 'proj_1',
      name: 'Steel Production Optimization',
      description: 'Comprehensive LCA analysis for steel production with circularity focus',
      status: 'active',
      owner: 'user_1',
      scenarios: ['scenario_1', 'scenario_2'],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      metadata: { industry: 'Steel', region: 'Global' },
    },
    {
      id: 'proj_2',
      name: 'Aluminum Recycling Analysis',
      description: 'End-to-end analysis of aluminum recycling processes',
      status: 'completed',
      owner: 'user_1',
      scenarios: ['scenario_3'],
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      metadata: { industry: 'Aluminum', region: 'Europe' },
    },
  ];

  async getAllProjects(owner?: string): Promise<Project[]> {
    if (owner) {
      return this.projects.filter(p => p.owner === owner);
    }
    return this.projects;
  }

  async getProjectById(id: string): Promise<Project> {
    const project = this.projects.find(p => p.id === id);
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    if (!createProjectDto.name || !createProjectDto.owner) {
      throw new BadRequestException('Name and owner are required');
    }

    const project: Project = {
      id: this.generateId(),
      name: createProjectDto.name,
      description: createProjectDto.description || '',
      status: 'draft',
      owner: createProjectDto.owner,
      scenarios: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: createProjectDto.metadata || {},
    };

    this.projects.push(project);
    return project;
  }

  async updateProject(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const projectIndex = this.projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    this.projects[projectIndex] = {
      ...this.projects[projectIndex],
      ...updateProjectDto,
      updatedAt: new Date(),
    };

    return this.projects[projectIndex];
  }

  async deleteProject(id: string): Promise<void> {
    const projectIndex = this.projects.findIndex(p => p.id === id);
    if (projectIndex === -1) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    this.projects.splice(projectIndex, 1);
  }

  async addScenarioToProject(projectId: string, scenarioId: string): Promise<Project> {
    const project = await this.getProjectById(projectId);
    
    if (project.scenarios.includes(scenarioId)) {
      throw new BadRequestException('Scenario already exists in project');
    }

    project.scenarios.push(scenarioId);
    project.updatedAt = new Date();

    return project;
  }

  async removeScenarioFromProject(projectId: string, scenarioId: string): Promise<Project> {
    const project = await this.getProjectById(projectId);
    
    const scenarioIndex = project.scenarios.indexOf(scenarioId);
    if (scenarioIndex === -1) {
      throw new BadRequestException('Scenario not found in project');
    }

    project.scenarios.splice(scenarioIndex, 1);
    project.updatedAt = new Date();

    return project;
  }

  async getProjectScenarios(projectId: string): Promise<any[]> {
    const project = await this.getProjectById(projectId);
    
    // Mock scenario data - in real implementation, this would query the scenarios service
    return project.scenarios.map((scenarioId, index) => ({
      id: scenarioId,
      name: `Scenario ${index + 1}`,
      status: 'completed',
      carbonFootprint: 2.1 - index * 0.2,
      circularityScore: 65 + index * 5,
      lastRun: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
    }));
  }

  async getProjectStatistics(projectId: string): Promise<any> {
    const project = await this.getProjectById(projectId);
    const scenarios = await this.getProjectScenarios(projectId);

    const stats = {
      projectId,
      name: project.name,
      totalScenarios: scenarios.length,
      completedScenarios: scenarios.filter(s => s.status === 'completed').length,
      averageCarbonFootprint: scenarios.reduce((sum, s) => sum + s.carbonFootprint, 0) / scenarios.length,
      averageCircularityScore: scenarios.reduce((sum, s) => sum + s.circularityScore, 0) / scenarios.length,
      lastActivity: new Date(Math.max(...scenarios.map(s => s.lastRun.getTime()))),
      status: project.status,
    };

    return stats;
  }

  async searchProjects(query: string, owner?: string): Promise<Project[]> {
    let results = owner ? this.projects.filter(p => p.owner === owner) : this.projects;
    
    if (query) {
      const searchQuery = query.toLowerCase();
      results = results.filter(project => 
        project.name.toLowerCase().includes(searchQuery) ||
        project.description.toLowerCase().includes(searchQuery)
      );
    }

    return results;
  }

  async getProjectsByStatus(status: string, owner?: string): Promise<Project[]> {
    let results = owner ? this.projects.filter(p => p.owner === owner) : this.projects;
    return results.filter(p => p.status === status);
  }

  async archiveProject(id: string): Promise<Project> {
    return this.updateProject(id, { status: 'archived' });
  }

  async activateProject(id: string): Promise<Project> {
    return this.updateProject(id, { status: 'active' });
  }

  async getProjectHistory(projectId: string): Promise<any[]> {
    // Mock project history - in real implementation, this would query audit logs
    return [
      {
        id: 1,
        action: 'created',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        user: 'user_1',
        details: 'Project created',
      },
      {
        id: 2,
        action: 'scenario_added',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        user: 'user_1',
        details: 'Scenario "Steel Production" added',
      },
      {
        id: 3,
        action: 'updated',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        user: 'user_1',
        details: 'Project description updated',
      },
    ];
  }

  private generateId(): string {
    return 'proj_' + Math.random().toString(36).substr(2, 9);
  }
}

