import { useEffect, useState } from 'react';
import { ProductLimitedTimeOfferController } from '@ui/controller';

export function useLimitedTimeOffer() {
  const [limitedTimeOfferIds, setLimitedTimeOfferIds] = useState<string[]>(
    ProductLimitedTimeOfferController.getInstance().ids,
  );

  useEffect(() => {
    const controller = ProductLimitedTimeOfferController.getInstance();
    const handleChange = () => setLimitedTimeOfferIds(controller.ids);
    handleChange();
    controller.on(handleChange);
    return () => controller.off(handleChange);
  }, []);

  return { ids: limitedTimeOfferIds };
}
