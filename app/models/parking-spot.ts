export interface ParkingSpot {
  parkingSpotId: number;
  name: string;
  occupied: boolean;
  updatedAt: Date;
  latitude: number;
  longitude: number;
}

export interface ParkingSpotCoordinates {
  spotId: number;
  longitude: number;
  latitude: number;
}

export interface FindClosestFreeParkingSpotResponse {
  operation: string;
  closestFreeSpot: ParkingSpot;
  success: boolean;
  error:string
}

export interface FavouriteSpotResponse {
  operation: string;
  favouriteSpot: ParkingSpotCoordinates | null;
  success: boolean;
  error:string
}

export interface ParkingSpotDetail {
  isFavourite: boolean;
  isNotificationEnabled: boolean;
  stateSince: Date
}

export interface SpotHistoryRecord {
  occupied: boolean;
  updatedAt: Date;
}

export interface ParkingSheetResponse {
  isFavourite: boolean;
  isNotificationEnabled: boolean;
  stateSince: Date;
}
