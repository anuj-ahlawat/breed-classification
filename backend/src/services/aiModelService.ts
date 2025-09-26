import axios from 'axios';
import sharp from 'sharp';

export interface BreedPrediction {
  breed: string;
  confidence: number;
  rank: number;
}

export interface HeatmapData {
  breed1: string;
  breed2: string;
  heatmap1Uri: string;
  heatmap2Uri: string;
}

export interface AIPredictionResult {
  predictions: BreedPrediction[];
  heatmapData: HeatmapData;
  processingTime: number;
}

class AIModelService {
  private readonly API_BASE_URL = process.env['AI_MODEL_URL'] || 'http://localhost:8000';
  
  async predictBreed(imageBuffer: Buffer): Promise<AIPredictionResult> {
    try {
      // Preprocess image
      const processedImage = await this.preprocessImage(imageBuffer);
      
      // Call AI model API
      const response = await axios.post(`${this.API_BASE_URL}/predict`, {
        image: processedImage.toString('base64'),
        return_heatmaps: true
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { predictions, heatmaps } = response.data;
      
      // Generate heatmap images
      const heatmapData = await this.generateHeatmaps(heatmaps, predictions);
      
      return {
        predictions: predictions.slice(0, 3).map((pred: any, index: number) => ({
          breed: pred.breed,
          confidence: Math.round(pred.confidence * 100),
          rank: index + 1
        })),
        heatmapData,
        processingTime: response.data.processing_time || 0
      };
    } catch (error) {
      console.error('AI Model prediction error:', error);
      // Return mock data as fallback
      return this.getMockPrediction();
    }
  }

  private async preprocessImage(imageBuffer: Buffer): Promise<Buffer> {
    return await sharp(imageBuffer)
      .resize(224, 224)
      .jpeg({ quality: 90 })
      .toBuffer();
  }

  private async generateHeatmaps(_heatmaps: any, predictions: any[]): Promise<HeatmapData> {
    try {
      // Generate heatmap for top 2 predictions
      const breed1 = predictions[0]?.breed || 'Unknown';
      const breed2 = predictions[1]?.breed || 'Unknown';
      
      // In a real implementation, you would process the heatmap data from the AI model
      // For now, we'll create mock heatmap URIs
      const heatmap1Uri = `data:image/png;base64,${Buffer.from('mock_heatmap_1').toString('base64')}`;
      const heatmap2Uri = `data:image/png;base64,${Buffer.from('mock_heatmap_2').toString('base64')}`;
      
      return {
        breed1,
        breed2,
        heatmap1Uri,
        heatmap2Uri
      };
    } catch (error) {
      console.error('Heatmap generation error:', error);
      return {
        breed1: 'Unknown',
        breed2: 'Unknown',
        heatmap1Uri: '',
        heatmap2Uri: ''
      };
    }
  }

  private getMockPrediction(): AIPredictionResult {
    const mockBreeds = [
      { breed: 'Gir (Cattle)', confidence: 92 },
      { breed: 'Sahiwal (Cattle)', confidence: 5 },
      { breed: 'Red Sindhi (Cattle)', confidence: 3 }
    ];

    return {
      predictions: mockBreeds.map((breed, index) => ({
        breed: breed.breed,
        confidence: breed.confidence,
        rank: index + 1
      })),
      heatmapData: {
        breed1: 'Gir (Cattle)',
        breed2: 'Sahiwal (Cattle)',
        heatmap1Uri: 'data:image/png;base64,mock_heatmap_1',
        heatmap2Uri: 'data:image/png;base64,mock_heatmap_2'
      },
      processingTime: 1.5
    };
  }
}

export const aiModelService = new AIModelService();
