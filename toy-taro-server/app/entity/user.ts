import { ROLE } from "../utils/constants";

export interface UserEntity {
  id: string;
  name?: string;
  avatarUrl?: string;
  role: ROLE;
  score?: number;
}
