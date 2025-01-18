import { useEffect, useState } from 'react';
import { ToyLimitedTimeOfferController } from '@ui/controller';

export function useLimitedTimeOffer() {
  const [limitedTimeOfferIds, setLimitedTimeOfferIds] = useState<string[]>(
    ToyLimitedTimeOfferController.getInstance().ids,
  );

  useEffect(() => {
    const controller = ToyLimitedTimeOfferController.getInstance();
    const handleChange = () => setLimitedTimeOfferIds(controller.ids);
    handleChange();
    controller.on(handleChange);
    return () => controller.off(handleChange);
  }, []);

  return { ids: limitedTimeOfferIds };
}
