import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

export interface Report {
  id: string;
  name: string;
  type: 'scenario' | 'comparison' | 'project' | 'summary';
  status: 'generating' | 'completed' | 'failed';
  projectId?: string;
  scenarioIds: string[];
  format: 'pdf' | 'excel' | 'json';
  createdAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
  metadata: Record<string, any>;
}

export interface GenerateReportRequest {
  name: string;
  type: 'scenario' | 'comparison' | 'project' | 'summary';
  projectId?: string;
  scenarioIds: string[];
  format: 'pdf' | 'excel' | 'json';
  template?: string;
  includeCharts?: boolean;
  includeRawData?: boolean;
  metadata?: Record<string, any>;
}

export interface ReportData {
  summary: {
    totalScenarios: number;
    averageCarbonFootprint: number;
    averageCircularityScore: number;
    totalEnergyConsumption: number;
    totalWaterConsumption: number;
  };
  scenarios: Array<{
    id: string;
    name: string;
    carbonFootprint: number;
    circularityScore: number;
    energyConsumption: number;
    waterConsumption: number;
    status: string;
  }>;
  charts: Array<{
    type: string;
    title: string;
    data: any;
  }>;
  recommendations: Array<{
    category: string;
    title: string;
    description: string;
    impact: string;
    effort: string;
  }>;
}

@Injectable()
export class ReportService {
  private reports: Report[] = [
    {
      id: 'report_1',
      name: 'Steel Production Analysis Report',
      type: 'project',
      status: 'completed',
      projectId: 'proj_1',
      scenarioIds: ['scenario_1', 'scenario_2'],
      format: 'pdf',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30000),
      downloadUrl: '/reports/report_1/download',
      metadata: { pages: 15, fileSize: '2.3MB' },
    },
  ];

  async generateReport(request: GenerateReportRequest): Promise<Report> {
    if (!request.name || !request.type || !request.scenarioIds.length) {
      throw new BadRequestException('Name, type, and scenario IDs are required');
    }

    const report: Report = {
      id: this.generateId(),
      name: request.name,
      type: request.type,
      status: 'generating',
      projectId: request.projectId,
      scenarioIds: request.scenarioIds,
      format: request.format,
      createdAt: new Date(),
      metadata: {
        template: request.template || 'default',
        includeCharts: request.includeCharts ?? true,
        includeRawData: request.includeRawData ?? false,
        ...request.metadata,
      },
    };

    this.reports.push(report);

    // Simulate report generation
    setTimeout(() => {
      this.completeReportGeneration(report.id);
    }, 5000);

    return report;
  }

  async getReportById(id: string): Promise<Report> {
    const report = this.reports.find(r => r.id === id);
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    return report;
  }

  async getAllReports(projectId?: string): Promise<Report[]> {
    if (projectId) {
      return this.reports.filter(r => r.projectId === projectId);
    }
    return this.reports;
  }

  async getReportData(id: string): Promise<ReportData> {
    const report = await this.getReportById(id);
    
    if (report.status !== 'completed') {
      throw new BadRequestException('Report is not completed yet');
    }

    // Mock report data generation
    return this.generateReportData(report);
  }

  private generateReportData(report: Report): ReportData {
    const scenarios = report.scenarioIds.map((id, index) => ({
      id,
      name: `Scenario ${index + 1}`,
      carbonFootprint: 2.1 - index * 0.2,
      circularityScore: 65 + index * 5,
      energyConsumption: 25.5 - index * 2,
      waterConsumption: 150 - index * 10,
      status: 'completed',
    }));

    const summary = {
      totalScenarios: scenarios.length,
      averageCarbonFootprint: scenarios.reduce((sum, s) => sum + s.carbonFootprint, 0) / scenarios.length,
      averageCircularityScore: scenarios.reduce((sum, s) => sum + s.circularityScore, 0) / scenarios.length,
      totalEnergyConsumption: scenarios.reduce((sum, s) => sum + s.energyConsumption, 0),
      totalWaterConsumption: scenarios.reduce((sum, s) => sum + s.waterConsumption, 0),
    };

    const charts = [
      {
        type: 'bar',
        title: 'Carbon Footprint by Scenario',
        data: scenarios.map(s => ({ name: s.name, value: s.carbonFootprint })),
      },
      {
        type: 'radar',
        title: 'Circularity Score Breakdown',
        data: scenarios.map(s => ({ name: s.name, value: s.circularityScore })),
      },
    ];

    const recommendations = [
      {
        category: 'Energy',
        title: 'Increase Renewable Energy Usage',
        description: 'Switch to 100% renewable energy sources to reduce CO2 emissions',
        impact: 'High',
        effort: 'Medium',
      },
      {
        category: 'Process',
        title: 'Optimize Process Efficiency',
        description: 'Upgrade equipment to improve process efficiency',
        impact: 'Medium',
        effort: 'High',
      },
    ];

    return {
      summary,
      scenarios,
      charts,
      recommendations,
    };
  }

  private async completeReportGeneration(reportId: string): Promise<void> {
    const reportIndex = this.reports.findIndex(r => r.id === reportId);
    if (reportIndex !== -1) {
      this.reports[reportIndex].status = 'completed';
      this.reports[reportIndex].completedAt = new Date();
      this.reports[reportIndex].downloadUrl = `/reports/${reportId}/download`;
      this.reports[reportIndex].metadata = {
        ...this.reports[reportIndex].metadata,
        pages: Math.floor(Math.random() * 20) + 10,
        fileSize: `${(Math.random() * 5 + 1).toFixed(1)}MB`,
      };
    }
  }

  async downloadReport(id: string): Promise<{ url: string; filename: string }> {
    const report = await this.getReportById(id);
    
    if (report.status !== 'completed') {
      throw new BadRequestException('Report is not ready for download');
    }

    const filename = `${report.name.replace(/\s+/g, '_')}.${report.format}`;
    
    return {
      url: report.downloadUrl || `/reports/${id}/download`,
      filename,
    };
  }

  async deleteReport(id: string): Promise<void> {
    const reportIndex = this.reports.findIndex(r => r.id === id);
    if (reportIndex === -1) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    this.reports.splice(reportIndex, 1);
  }

  async getReportTemplates(): Promise<any[]> {
    return [
      {
        id: 'default',
        name: 'Default Template',
        description: 'Standard report template with charts and recommendations',
        preview: '/templates/default/preview.png',
      },
      {
        id: 'executive',
        name: 'Executive Summary',
        description: 'High-level summary for executives',
        preview: '/templates/executive/preview.png',
      },
      {
        id: 'technical',
        name: 'Technical Report',
        description: 'Detailed technical analysis with raw data',
        preview: '/templates/technical/preview.png',
      },
    ];
  }

  async getReportStatistics(): Promise<any> {
    const totalReports = this.reports.length;
    const completedReports = this.reports.filter(r => r.status === 'completed').length;
    const generatingReports = this.reports.filter(r => r.status === 'generating').length;
    const failedReports = this.reports.filter(r => r.status === 'failed').length;

    return {
      total: totalReports,
      completed: completedReports,
      generating: generatingReports,
      failed: failedReports,
      successRate: totalReports > 0 ? (completedReports / totalReports) * 100 : 0,
      averageGenerationTime: this.calculateAverageGenerationTime(),
    };
  }

  private calculateAverageGenerationTime(): number {
    const completedReports = this.reports.filter(r => r.status === 'completed' && r.completedAt);
    
    if (completedReports.length === 0) return 0;

    const totalTime = completedReports.reduce((sum, report) => {
      const duration = report.completedAt!.getTime() - report.createdAt.getTime();
      return sum + duration;
    }, 0);

    return totalTime / completedReports.length / 1000; // Convert to seconds
  }

  private generateId(): string {
    return 'report_' + Math.random().toString(36).substr(2, 9);
  }
}

