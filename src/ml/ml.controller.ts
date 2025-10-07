import { Controller, Post, Get, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MLService } from './ml.service';
import type { MiningData, SustainabilityPrediction } from './ml.service';

@ApiTags('ML Predictions')
@Controller('ml')
export class MLController {
  constructor(private readonly mlService: MLService) {}

  @Get('test')
  @ApiOperation({ summary: 'Test ML service without authentication' })
  @ApiResponse({
    status: 200,
    description: 'ML service test successful',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        timestamp: { type: 'string' }
      }
    }
  })
  async testMLService() {
    return {
      success: true,
      message: 'ML service is working! Authentication not required for this endpoint.',
      timestamp: new Date().toISOString()
    };
  }

  @Post('predict')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Predict sustainability metrics for mining operations' })
  @ApiBody({
    description: 'Mining operation data for sustainability prediction',
    schema: {
      type: 'object',
      properties: {
        mine_id: { type: 'string', example: 'M00001' },
        mine_name: { type: 'string', example: 'Aluminium Block-2 (Rajasthan)' },
        state: { type: 'string', example: 'Rajasthan' },
        mineral: { type: 'string', example: 'Aluminium' },
        mine_status: { type: 'string', example: 'Active' },
        life_cycle_stage: { type: 'string', example: 'Extraction' },
        production_tonnes: { type: 'number', example: 711925.0 },
        recycled_input_percent: { type: 'number', example: 19.49 },
        energy_source: { type: 'string', example: 'Grid' },
        energy_consumption_mwh: { type: 'number', example: 7030.52 },
        co2_emissions_tonnes: { type: 'number', example: 108593.07 },
        water_usage_m3: { type: 'number', example: 253778.0 },
        waste_generated_tonnes: { type: 'number', example: 2540733.0 },
        transport_distance_km: { type: 'number', example: 127.0 },
        employment_generated: { type: 'number', example: 38913.0 },
        local_community_investment_inr: { type: 'number', example: 190593266.0 }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Sustainability prediction successful',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            recyclability_score: { type: 'number', example: 72.5 },
            reuse_potential_score: { type: 'number', example: 51.2 },
            product_life_extension_years: { type: 'number', example: 2.71 },
            confidence: { type: 'number', example: 0.85 },
            recommendations: {
              type: 'array',
              items: { type: 'string' },
              example: [
                'Excellent recyclability potential - prioritize recycling infrastructure',
                'High reuse potential - develop circular economy initiatives'
              ]
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Invalid mining data provided' }
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: 'ML prediction failed',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Sustainability prediction failed' }
      }
    }
  })
  async predictSustainability(@Body() miningData: MiningData) {
    try {
      if (!miningData) {
        throw new HttpException('Mining data is required', HttpStatus.BAD_REQUEST);
      }

      const prediction = await this.mlService.predictSustainability(miningData);
      
      return {
        success: true,
        data: prediction,
        message: 'Sustainability prediction completed successfully'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Sustainability prediction failed',
          error: 'ML_PREDICTION_ERROR'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('model-info')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get information about the ML model' })
  @ApiResponse({
    status: 200,
    description: 'Model information retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            model_type: { type: 'string', example: 'LGBMRegressor' },
            n_features: { type: 'number', example: 15 },
            n_estimators: { type: 'number', example: 100 },
            boosting_type: { type: 'string', example: 'gbdt' }
          }
        }
      }
    }
  })
  async getModelInfo() {
    try {
      const modelInfo = await this.mlService.getModelInfo();
      
      return {
        success: true,
        data: modelInfo,
        message: 'Model information retrieved successfully'
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to get model information',
          error: 'ML_MODEL_INFO_ERROR'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('batch-predict')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Predict sustainability metrics for multiple mining operations' })
  @ApiBody({
    description: 'Array of mining operation data for batch prediction',
    schema: {
      type: 'object',
      properties: {
        operations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              mine_id: { type: 'string' },
              mine_name: { type: 'string' },
              state: { type: 'string' },
              mineral: { type: 'string' },
              mine_status: { type: 'string' },
              life_cycle_stage: { type: 'string' },
              production_tonnes: { type: 'number' },
              recycled_input_percent: { type: 'number' },
              energy_source: { type: 'string' },
              energy_consumption_mwh: { type: 'number' },
              co2_emissions_tonnes: { type: 'number' },
              water_usage_m3: { type: 'number' },
              waste_generated_tonnes: { type: 'number' },
              transport_distance_km: { type: 'number' },
              employment_generated: { type: 'number' },
              local_community_investment_inr: { type: 'number' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Batch prediction successful',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              mine_id: { type: 'string' },
              predictions: {
                type: 'object',
                properties: {
                  recyclability_score: { type: 'number' },
                  reuse_potential_score: { type: 'number' },
                  product_life_extension_years: { type: 'number' },
                  confidence: { type: 'number' },
                  recommendations: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        }
      }
    }
  })
  async batchPredict(@Body() body: { operations: MiningData[] }) {
    try {
      if (!body.operations || !Array.isArray(body.operations)) {
        throw new HttpException('Operations array is required', HttpStatus.BAD_REQUEST);
      }

      if (body.operations.length === 0) {
        throw new HttpException('At least one operation is required', HttpStatus.BAD_REQUEST);
      }

      if (body.operations.length > 10) {
        throw new HttpException('Maximum 10 operations allowed per batch', HttpStatus.BAD_REQUEST);
      }

      const predictions = await Promise.all(
        body.operations.map(async (operation, index) => {
          try {
            const prediction = await this.mlService.predictSustainability(operation);
            return {
              mine_id: operation.mine_id || `M${String(index + 1).padStart(5, '0')}`,
              predictions: prediction
            };
          } catch (error) {
            return {
              mine_id: operation.mine_id || `M${String(index + 1).padStart(5, '0')}`,
              predictions: {
                recyclability_score: 50.0,
                reuse_potential_score: 50.0,
                product_life_extension_years: 2.0,
                confidence: 0.5,
                recommendations: ['Prediction failed - using default values']
              },
              error: error.message
            };
          }
        })
      );
      
      return {
        success: true,
        data: predictions,
        message: `Batch prediction completed for ${predictions.length} operations`
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Batch prediction failed',
          error: 'ML_BATCH_PREDICTION_ERROR'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
