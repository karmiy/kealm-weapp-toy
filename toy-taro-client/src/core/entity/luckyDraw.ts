import { LUCKY_DRAW_TYPE } from '../constants';

export interface LuckDrawPrize {
  prize_id: string;
  range: number;
}

export interface LuckyDrawEntity {
  id: string;
  type: LUCKY_DRAW_TYPE;
  name: string;
  quantity: number;
  list: Array<LuckDrawPrize>;
  create_time: number;
  last_modified_time: number;
}
