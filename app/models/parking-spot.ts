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
  history: ParkingSpotDetailHistoryRecord[];
}

export interface ParkingSpotDetailHistoryRecord {
  occupied: boolean;
  updatedAt: Date;
}
