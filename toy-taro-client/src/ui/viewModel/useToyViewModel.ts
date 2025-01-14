import { useEffect, useState } from 'react';
import { ToyCategoryController, ToyLimitedTimeOfferController } from '@ui/controller';

interface ToyViewModelProps {
  limitedTimeOffer?: {
    enable?: boolean;
  };
  category?: {
    enable?: boolean;
    categoryId: string;
  };
}

export function useToyViewModel(props: ToyViewModelProps) {
  const { limitedTimeOffer, category } = props;

  const [limitedTimeOfferIds, setLimitedTimeOfferIds] = useState<string[]>(
    ToyLimitedTimeOfferController.getInstance().ids,
  );

  useEffect(() => {
    if (!limitedTimeOffer?.enable) {
      return;
    }
    const controller = ToyLimitedTimeOfferController.getInstance();
    const handleChange = () => setLimitedTimeOfferIds(controller.ids);
    handleChange();
    controller.on(handleChange);
    return () => controller.off(handleChange);
  }, [limitedTimeOffer?.enable]);

  const [toyIdsForCategory, setToyListForCategory] = useState<string[]>(() => {
    const { enable, categoryId } = category ?? {};
    return enable && categoryId ? ToyCategoryController.getInstance().getToyIds(categoryId) : [];
  });

  useEffect(() => {
    if (!category?.enable || !category?.categoryId) {
      return;
    }
    const categoryId = category.categoryId;
    const controller = ToyCategoryController.getInstance();
    const handleChange = () => setToyListForCategory(controller.getToyIds(categoryId));
    handleChange();
    controller.onToyListChange(category.categoryId, handleChange);
    return () => controller.offToyListChange(category.categoryId, handleChange);
  }, [category?.enable, category?.categoryId]);

  return {
    limitedTimeOffer: { ids: limitedTimeOfferIds },
    category: { toyIds: toyIdsForCategory },
  };
}
