export type UserIdentity = "seeker" | "provider";

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  role: UserIdentity;
  updated_at: string;
  phone: string;
  dob: string;
  gender: string;
}

export type StoredUserProfiles = Partial<Record<UserIdentity, UserProfile>>;
