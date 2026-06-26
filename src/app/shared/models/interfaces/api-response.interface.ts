export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    current_page: number;
    last_page: number;
  };
  message?: string;
}
