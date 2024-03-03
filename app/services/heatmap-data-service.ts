import { HeatmapPoint } from '../models/heatmap';

const API_BASE_URL = 'http://192.168.100.11:8080/parking';

export const fetchHeatmapData = async (): Promise<HeatmapPoint[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/heatmap`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const heatmapData: HeatmapPoint[] = Object.values(data).map((value: any) => ({
      latitude: value.latitude,
      longitude: value.longitude,
      weight: value.timesOccupied
    }));

    return heatmapData;
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    throw error;
  }
};
