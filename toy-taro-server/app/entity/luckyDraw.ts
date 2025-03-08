import { LUCKY_DRAW_TYPE } from "../utils/constants";

export interface LuckDrawPrize {
  prize_id: string;
  range: number;
}

export interface LuckyDrawEntity {
  id: string;
  type: LUCKY_DRAW_TYPE;
  cover_image: string;
  name: string;
  quantity: number;
  list: Array<LuckDrawPrize>;
  create_time: number;
  last_modified_time: number;
}

export interface LuckyDrawHistoryEntity {
  id: string;
  prize_id: string;
  user_id: string;
  create_time: number;
  last_modified_time: number;
}
