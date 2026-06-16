// src/entities/user/model/user.mapper.ts

import type { UserDTO } from "@/shared/api/auth-api";
import type { User, UserId } from "@/types";

export const userMapper = {
  toEntity: (dto: UserDTO): User => ({
    _id: dto.id as UserId,
    name: dto.username,
    email: dto.email,
    seller: dto.isAdmin === true,
  }),
  toDto: (user: Pick<User, "name" | "email" | "seller">): Partial<UserDTO> => ({
    username: user.name,
    email: user.email,
    isAdmin: user.seller,
  }),
};
