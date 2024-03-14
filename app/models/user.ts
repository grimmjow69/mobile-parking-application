export interface LoginUserResponse {
  success: boolean;
  message: string;
  user: any;
}

export interface RegisterUserResponse {
  success: boolean;
  message: string;
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
}

export interface UserData {
  email: string;
  favouriteSpotId: number;
  userId: number;
}
