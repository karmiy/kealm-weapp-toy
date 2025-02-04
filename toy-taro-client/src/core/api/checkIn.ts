import { CheckInEntity } from '../entity';
import { httpRequest } from '../httpRequest';
import { mock, MOCK_API_NAME } from '../mock';

export class CheckInApi {
  @mock({ name: MOCK_API_NAME.GET_CHECK_IN_INFO, enable: false })
  static async getCheckInList(): Promise<CheckInEntity> {
    return httpRequest.get<CheckInEntity>({
      url: '/checkIn/getCheckInList',
    });
  }

  @mock({ name: MOCK_API_NAME.CLAIM_REWARD, enable: false })
  static async claimReward(ruleId: string): Promise<void> {
    return httpRequest.post<void>({
      url: '/checkIn/claimReward',
      data: {
        rule_id: ruleId,
      },
    });
  }

  @mock({ name: MOCK_API_NAME.CHECK_IN_TODAY, enable: false })
  static async checkInToday(): Promise<void> {
    return httpRequest.post<void>({
      url: '/checkIn/checkInToday',
    });
  }
}
