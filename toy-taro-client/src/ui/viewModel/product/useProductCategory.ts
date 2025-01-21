import { useEffect, useState } from 'react';
import { ProductCategoryController } from '@ui/controller';

interface Props {
  categoryId: string;
}

export function useProductCategory(props: Props) {
  const { categoryId } = props;

  const [productIdsForCategory, setProductListForCategory] = useState<string[]>(() => {
    return ProductCategoryController.getInstance().getIds(categoryId) ?? [];
  });

  useEffect(() => {
    const controller = ProductCategoryController.getInstance();
    const handleChange = () => setProductListForCategory(controller.getIds(categoryId));
    handleChange();
    controller.onCategoryListChange(categoryId, handleChange);
    return () => controller.offCategoryListChange(categoryId, handleChange);
  }, [categoryId]);

  return {
    productIds: productIdsForCategory,
  };
}
