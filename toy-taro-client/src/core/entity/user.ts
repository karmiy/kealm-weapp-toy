import { ROLE } from '../constants';

export interface UserEntity {
  id: string;
  name?: string;
  avatarUrl?: string;
  role: ROLE;
  score?: number;
}

export type ContactEntity = UserEntity;
