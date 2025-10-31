import { CareCategory, CareModule } from "./care";

export type UserIdentity = "care_seeker" | "care_provider";

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  role: UserIdentity;
  updated_at?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  module?: CareModule;
  category?: CareCategory;
  specialty?: string;
  reviews?: number;
  patients?: number;
  experience_years?: number;
  about?: string;
  location?: string;
  charges?: {
    home: string;
    online: string;
    clinic: string;
  };
  availability?: string;
}

export type StoredUserProfiles = Partial<Record<UserIdentity, UserProfile>>;
