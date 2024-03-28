export interface HeatmapPoint {
  weight: number;
  latitude: number;
  longitude: number;
}

export interface HeatmapResponse {
  operation: string;
  parkingSpotsOccupancyCount: HeatmapPoint[];
  success: boolean;
  error: string;
}
