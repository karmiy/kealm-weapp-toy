import { useEffect, useState } from 'react';
import { ToyCategoryController } from '@ui/controller';

interface Props {
  categoryId: string;
}

export function useToyCategory(props: Props) {
  const { categoryId } = props;

  const [toyIdsForCategory, setToyListForCategory] = useState<string[]>(() => {
    return ToyCategoryController.getInstance().getToyIds(categoryId) ?? [];
  });

  useEffect(() => {
    const controller = ToyCategoryController.getInstance();
    const handleChange = () => setToyListForCategory(controller.getToyIds(categoryId));
    handleChange();
    controller.onToyListChange(categoryId, handleChange);
    return () => controller.offToyListChange(categoryId, handleChange);
  }, [categoryId]);

  return {
    toyIds: toyIdsForCategory,
  };
}
