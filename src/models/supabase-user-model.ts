export interface SupabaseUser {
  id: string;
  created_at: string | Date;
  discord_id: string;
  email: string;
  role: string;
  token: string;
  token_expires: string;
  token_created: string;
  verified: boolean;
}
