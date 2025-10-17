export type UserModel = {
  id: number;
  externalId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  name: string;
  email: string;
  password: string;
  phone?: string | null;
  avatar?: string | null;
  [key: string]: any;
};
export type UserResource = Omit<UserModel, 'id' | 'password'>;

export function toUserResource(user: UserModel): UserResource {
  const { id, password, ...rest } = user;
  return rest;
}

export function toUsersResource(users: UserModel[]): UserResource[] {
  return users.map(toUserResource);
}