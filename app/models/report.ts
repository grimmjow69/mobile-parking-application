export interface ReportRequest {
  userId: number;
  reportMessage: string;
  category: ReportCategory;
}

export interface ReportResponse {
  success: boolean;
  message: string;
}

export enum ReportCategory {
  BUG = 'BUG',
  FORGOTTEN_PASSWORD = 'FORGOTTEN_PASSWORD'
}
