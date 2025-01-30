import { useEffect, useState } from 'react';
import { ProductGroupController } from '@ui/controller';

interface Props {
  categoryId: string;
}

export function useProductGroup(props: Props) {
  const { categoryId } = props;

  const [productIdsForCategory, setProductListForCategory] = useState<string[]>(() => {
    return ProductGroupController.getInstance().getIds(categoryId) ?? [];
  });

  useEffect(() => {
    const controller = ProductGroupController.getInstance();
    const handleChange = () => setProductListForCategory(controller.getIds(categoryId));
    handleChange();
    controller.onGroupListChange(categoryId, handleChange);
    return () => controller.offGroupListChange(categoryId, handleChange);
  }, [categoryId]);

  return {
    productIds: productIdsForCategory,
  };
}
