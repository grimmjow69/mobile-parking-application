export interface ParkingSpot {
  parkingSpotId: number;
  name: string;
  occupied: boolean;
  updatedAt: Date;
  latitude: number;
  longitude: number;
}
