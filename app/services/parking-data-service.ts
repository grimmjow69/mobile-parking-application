import { HeatmapPoint } from '../models/heatmap';
import { ParkingSpot, ParkingSpotCoordinates } from '../models/parking-spot';

const API_BASE_URL = 'http://192.168.100.11:8080/parking';

export const fetchSpotCoordinates = async (spotId: number): Promise<ParkingSpotCoordinates> => {
  try {
    const response = await fetch(`${API_BASE_URL}/spot-coordinates/${spotId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ParkingSpotCoordinates = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching all spots data:', error);
    throw error;
  }
};

export const fetchAllSpotsData = async (): Promise<ParkingSpot[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/all-spots`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ParkingSpot[] = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching all spots data:', error);
    throw error;
  }
};

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
