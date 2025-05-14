export interface ApiKey {
  id: number;
  key: string;
  role: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}
