import type { UserId } from "./common";

export interface User {
  _id: UserId;
  name: string;
  email: string;
  seller?: boolean;
  profile_picture?: string;
  created?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  seller?: boolean;
}
