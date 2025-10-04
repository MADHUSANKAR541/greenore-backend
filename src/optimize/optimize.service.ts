import { Injectable, BadRequestException } from '@nestjs/common';

export interface OptimizationRequest {
  objectives: {
    minimizeCO2: boolean;
    minimizeCost: boolean;
    maximizeCircularity: boolean;
  };
  weights: {
    co2: number;
    cost: number;
    circularity: number;
  };
  constraints: {
    maxCost?: number;
    minCircularity?: number;
    maxCO2?: number;
    availableMaterials?: string[];
    availableProcesses?: string[];
  };
  currentScenario: any;
}

export interface OptimizationResult {
  id: string;
  score: number;
  parameters: {
    material: any;
    route: any;
    energy: any;
    transport: any;
    endOfLife: any;
  };
  metrics: {
    co2: number;
    cost: number;
    circularity: number;
  };
  improvements: {
    co2Reduction: number;
    costSavings: number;
    circularityGain: number;
  };
}

@Injectable()
export class OptimizeService {
  async optimizeScenario(request: OptimizationRequest): Promise<OptimizationResult[]> {
    if (!request.objectives || !request.weights) {
      throw new BadRequestException('Objectives and weights are required');
    }

    // Mock optimization - in real implementation, this would use NSGA-II or similar
    const results = this.performOptimization(request);
    
    return results;
  }

  private performOptimization(request: OptimizationRequest): OptimizationResult[] {
    const results: OptimizationResult[] = [];
    const currentMetrics = this.evaluateScenario(request.currentScenario);

    // Generate multiple optimization solutions
    for (let i = 0; i < 5; i++) {
      const solution = this.generateOptimizedSolution(request, i);
      const metrics = this.evaluateScenario(solution);
      
      results.push({
        id: `opt_${i + 1}`,
        score: this.calculateScore(metrics, request.weights),
        parameters: solution,
        metrics,
        improvements: {
          co2Reduction: currentMetrics.co2 - metrics.co2,
          costSavings: currentMetrics.cost - metrics.cost,
          circularityGain: metrics.circularity - currentMetrics.circularity,
        },
      });
    }

    // Sort by score (higher is better)
    return results.sort((a, b) => b.score - a.score);
  }

  private generateOptimizedSolution(request: OptimizationRequest, index: number): any {
    // Mock solution generation
    const baseSolution = { ...request.currentScenario };
    
    // Apply optimizations based on objectives
    if (request.objectives.minimizeCO2) {
      baseSolution.energy.renewable = Math.min(100, baseSolution.energy.renewable + 20 + index * 5);
      baseSolution.route.efficiency = Math.min(1, baseSolution.route.efficiency + 0.1 + index * 0.02);
    }
    
    if (request.objectives.maximizeCircularity) {
      baseSolution.endOfLife.recyclingRate = Math.min(1, baseSolution.endOfLife.recyclingRate + 0.15 + index * 0.03);
      baseSolution.endOfLife.recoveryEfficiency = Math.min(1, baseSolution.endOfLife.recoveryEfficiency + 0.1 + index * 0.02);
    }
    
    if (request.objectives.minimizeCost) {
      baseSolution.transport.distance = Math.max(0, baseSolution.transport.distance - 20 - index * 5);
    }

    return baseSolution;
  }

  private evaluateScenario(scenario: any): { co2: number; cost: number; circularity: number } {
    // Mock evaluation - in real implementation, this would use the CalculateService
    const baseCO2 = 2.1;
    const baseCost = 1000;
    const baseCircularity = 0.75;

    const co2 = baseCO2 * (1 - (scenario.energy?.renewable || 0) / 200) * (1 - (scenario.route?.efficiency || 0.8) / 2);
    const cost = baseCost * (1 + (scenario.transport?.distance || 100) / 1000) * (1 - (scenario.route?.efficiency || 0.8) / 2);
    const circularity = baseCircularity + (scenario.endOfLife?.recyclingRate || 0.75) * 0.2 + (scenario.endOfLife?.recoveryEfficiency || 0.8) * 0.1;

    return {
      co2: Math.max(0, co2),
      cost: Math.max(0, cost),
      circularity: Math.min(1, circularity),
    };
  }

  private calculateScore(metrics: any, weights: any): number {
    // Normalize metrics to 0-1 scale and calculate weighted score
    const normalizedCO2 = Math.max(0, 1 - metrics.co2 / 5); // Assume max CO2 is 5
    const normalizedCost = Math.max(0, 1 - metrics.cost / 2000); // Assume max cost is 2000
    const normalizedCircularity = metrics.circularity;

    return (
      normalizedCO2 * weights.co2 +
      normalizedCost * weights.cost +
      normalizedCircularity * weights.circularity
    ) / (weights.co2 + weights.cost + weights.circularity);
  }

  async getOptimizationHistory(): Promise<any[]> {
    // Mock optimization history
    return [
      {
        id: 1,
        scenarioId: 'scenario_1',
        timestamp: new Date(),
        objectives: ['minimizeCO2', 'maximizeCircularity'],
        bestScore: 0.85,
        improvements: {
          co2Reduction: 0.3,
          circularityGain: 0.15,
        },
      },
      {
        id: 2,
        scenarioId: 'scenario_2',
        timestamp: new Date(Date.now() - 86400000),
        objectives: ['minimizeCost', 'maximizeCircularity'],
        bestScore: 0.78,
        improvements: {
          costSavings: 200,
          circularityGain: 0.12,
        },
      },
    ];
  }

  async getOptimizationRecommendations(scenarioId: string): Promise<any[]> {
    // Mock recommendations
    return [
      {
        type: 'energy',
        title: 'Increase Renewable Energy Usage',
        description: 'Switch to 100% renewable energy sources to reduce CO2 emissions by 30%',
        impact: 'High',
        effort: 'Medium',
        cost: 50000,
        co2Reduction: 0.5,
      },
      {
        type: 'process',
        title: 'Optimize Process Efficiency',
        description: 'Upgrade equipment to improve process efficiency by 15%',
        impact: 'Medium',
        effort: 'High',
        cost: 100000,
        co2Reduction: 0.2,
      },
      {
        type: 'transport',
        title: 'Optimize Transportation Routes',
        description: 'Use local suppliers to reduce transport distance by 40%',
        impact: 'Medium',
        effort: 'Low',
        cost: 10000,
        co2Reduction: 0.1,
      },
    ];
  }
}

