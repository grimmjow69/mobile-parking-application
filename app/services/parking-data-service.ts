import { HeatmapPoint } from '../models/heatmap';
import { ParkingSpot, ParkingSpotCoordinates, ParkingSpotDetail } from '../models/parking-spot';

const API_BASE_URL = 'http://192.168.100.11:8080/parking';

export const getClosestFreeParkingSpot = async (startLatitude: number, startLongitude: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/find-closest-free-spot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ latitude: startLatitude, longitude: startLongitude })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const closestSpotDetail = await response.json();
    return closestSpotDetail;
  } catch (error) {
    console.error('Error fetching closest free parking spot:', error);
    throw error;
  }
};

export const fetchUserFavouriteSpot = async (userId: number): Promise<ParkingSpot | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/favourite-spot/${userId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const jsonResponse = await response.json();

    const favouriteSpot: ParkingSpot | null = jsonResponse.favouriteSpot;
    return favouriteSpot;
  } catch (error) {
    console.error('Error fetching user favourite spot:', error);
    throw error;
  }
};

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

export const fetchSpotDetailById = async (userId: number, spotId: number): Promise<ParkingSpotDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/spot-detail-by-id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, spotId })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonResponse = await response.json();

    const parkingSpotDetail: ParkingSpotDetail = jsonResponse.data;
    return parkingSpotDetail;
  } catch (error) {
    console.error('Error fetching spot detail by ID:', error);
    throw error;
  }
};
