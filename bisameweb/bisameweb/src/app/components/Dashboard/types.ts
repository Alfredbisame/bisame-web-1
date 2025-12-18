export interface DashboardData {
  info: {
    name: string;
    email: string;
    phone: string;
    profile: string;
  };
  lifetime: {
    total: number;
    affiliate: number;
    earnings: number;
  };
  affiliates: {
    today: number;
    week: number;
    month: number;
    total?: number; // Optional, for backward compatibility
  };
  earnings: {
    today: number;
    week: number;
    month: number;
    total?: number; // Optional, for backward compatibility
  };
}