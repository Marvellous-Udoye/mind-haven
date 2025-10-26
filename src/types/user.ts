export type UserIdentity = "seeker" | "provider";

export interface UserProfile {
  identity: UserIdentity;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  createdAt: string;
}

export type StoredUserProfiles = Partial<Record<UserIdentity, UserProfile>>;
