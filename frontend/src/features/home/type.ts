export type NavigationProps = {
  onActiveTab: (tab: string) => void;
  activeTab: string;
};

export interface NotificationModel {
  id: number;
  message: string;
  data: string;
  type: string;
}
