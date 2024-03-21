export interface ParkingSpot {
  parkingSpotId: number;
  name: string;
  occupied: boolean;
  updatedAt: Date;
  latitude: number;
  longitude: number;
}

export interface ParkingSpotCoordinates {
  longitude: number;
  latitude: number;
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
