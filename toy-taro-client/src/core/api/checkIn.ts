import { CheckInEntity } from '../entity';
import { mock, MOCK_API_NAME } from '../mock';

export class CheckInApi {
  @mock({ name: MOCK_API_NAME.GET_CHECK_IN_INFO })
  static async getCheckInList(): Promise<CheckInEntity> {
    return Promise.resolve({} as CheckInEntity);
  }

  @mock({ name: MOCK_API_NAME.CLAIM_REWARD })
  static async claimReward(ruleId: string): Promise<void> {
    return;
  }

  @mock({ name: MOCK_API_NAME.CHECK_IN_TODAY })
  static async checkInToday(): Promise<void> {
    return;
  }
}
