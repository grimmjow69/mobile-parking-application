import { HeatmapPoint, HeatmapResponse } from '../models/heatmap';
import { FavouriteSpotResponse, FindClosestFreeParkingSpotResponse, ParkingSheetResponse, ParkingSpot, ParkingSpotCoordinates, SpotHistoryRecord } from '../models/parking-spot';
import { defaultRequestHeader } from './request-header';

const API_BASE_URL = 'http://192.168.100.11:8080/parking';

type ParkingSpotsResponse = {
  updatedAt: string;
  data: ParkingSpot[];
};

export const findClosestFreeParkingSpot = async (
  startLatitude: number,
  startLongitude: number
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/closest-free-spot`, {
      method: 'POST',
      headers: defaultRequestHeader,
      body: JSON.stringify({
        latitude: startLatitude,
        longitude: startLongitude
      })
    });

    const closestSpotDetail: FindClosestFreeParkingSpotResponse =
      await response.json();
    return closestSpotDetail;
  } catch (error) {
    throw error;
  }
};

export const getUserFavouriteSpot = async (
  userId: number
): Promise<ParkingSpotCoordinates | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/user-favourite-spot/${userId}`,
      {
        method: 'GET',
        headers: defaultRequestHeader
      }
    );

    const jsonResponse: FavouriteSpotResponse = await response.json();
    return jsonResponse.favouriteSpot;
  } catch (error) {
    throw error;
  }
};

export const getAllParkingSpotsData =
  async (): Promise<ParkingSpotsResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/parking-spots`, {
        method: 'GET',
        headers: defaultRequestHeader
      });

      const result: ParkingSpotsResponse = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  };

export const getHeatmapData = async (): Promise<HeatmapPoint[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/heatmap`, {
      method: 'GET',
      headers: defaultRequestHeader
    });

    const data: HeatmapResponse = await response.json();
    const heatmapData: HeatmapPoint[] = Object.values(
      data.parkingSpotsOccupancyCount
    ).map((value: any) => ({
      latitude: value.latitude,
      longitude: value.longitude,
      weight: value.weight
    }));
    return heatmapData;
  } catch (error) {
    throw error;
  }
};

export const getSpotHistory = async (
  spotId: number
): Promise<SpotHistoryRecord[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/spot-history/${spotId}`, {
      method: 'GET',
      headers: defaultRequestHeader
    });

    const jsonResponse = await response.json();
    return jsonResponse.historyRecords;
  } catch (error) {
    throw error;
  }
};

export const getSpotDetailById = async (
  userId: number,
  spotId: number
): Promise<ParkingSheetResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/spot-detail`, {
      method: 'POST',
      headers: defaultRequestHeader,
      body: JSON.stringify({
        userId,
        spotId
      })
    });

    const jsonResponse = await response.json();
    const parkingSpotDetail: ParkingSheetResponse = jsonResponse.data;

    return parkingSpotDetail;
  } catch (error) {
    throw error;
  }
};
