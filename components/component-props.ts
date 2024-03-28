import { ModalContent, ParkingSheetContent } from '@/app/(tabs)';

export interface ChangeEmailProps {
  visible: boolean;
  onDismiss: () => void;
  setLoading: (loading: boolean) => void;
  setSnackBarContent: (message: string, colorCode: string) => void;
  setSnackBarVisible: (visible: boolean) => void;
}

export interface ChangePasswordProps {
  visible: boolean;
  onDismiss: () => void;
  setLoading: (loading: boolean) => void;
  setSnackBarContent: (message: string, colorCode: string) => void;
  setSnackBarVisible: (visible: boolean) => void;
}

export interface LoginFormProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setSnackBarContent: (message: string, colorCode: string) => void;
  setSnackBarVisible: (visible: boolean) => void;
}

export interface ParkingSheetProps {
  sheetContent: ParkingSheetContent;
  openSpotHistory: (spotName: string, spotId: number) => void;
  isFavourite: boolean;
  notificationsEnabled: boolean;
  setLoading: (loading: boolean) => void;
  setNotificationsEnabled: (enable: boolean) => void;
  setIsFavourite: (favourite: boolean) => void;
  setSnackBarContent: (message: string, colorCode: string) => void;
  setSnackBarVisible: (visible: boolean) => void;
}

export interface ParkingSpotHistoryProps {
  modalContent: ModalContent | null;
  setModalVisible: (visible: boolean) => void;
}

export interface ReportBugPropss {
  visible: boolean;
  onDismiss: () => void;
  setSnackBarContent: (message: string, colorCode: string) => void;
  setLoading: (loading: boolean) => void;
  setSnackBarVisible: (visible: boolean) => void;
}

export interface UserContentProps {
  toggleChangeEmailModal: () => void;
  toggleChangePasswordModal: () => void;
  handleSignOut: () => void;
  isChangeEmailVisible: boolean;
  isChangePasswordVisible: boolean;
  setLoading: (loading: boolean) => void;
  setSnackBarContent: (message: string, colorCode: string) => void;
  setSnackBarVisible: (visible: boolean) => void;
}
