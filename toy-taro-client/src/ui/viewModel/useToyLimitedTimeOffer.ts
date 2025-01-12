import { useEffect, useState } from 'react';
import { ToyLimitedTimeOfferController } from '@ui/controller';

export function useToyLimitedTimeOffer() {
  const [ids, setIds] = useState<string[]>(ToyLimitedTimeOfferController.getInstance().ids);

  useEffect(() => {
    const controller = ToyLimitedTimeOfferController.getInstance();
    const handleIdsChange = () => setIds(controller.ids);
    controller.on(handleIdsChange);
    return () => controller.off(handleIdsChange);
  }, []);

  return { ids };
}
