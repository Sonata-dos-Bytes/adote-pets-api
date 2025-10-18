import { AWS_CONFIG } from "@config/index";
import { User } from "@prisma/client";
import { buildPublicUrl } from "src/services/aws-s3.service";

export type UserResource = Omit<User, 'id' | 'password'>;

export function toUserResource(user: User): UserResource {
  const { id, password, ...rest } = user;
  return {
    ...rest,
    avatar: user.avatar ? buildPublicUrl(AWS_CONFIG.bucket, user.avatar) : null,
  };
}

export function toUsersResource(users: User[]): UserResource[] {
  return users.map(toUserResource);
}