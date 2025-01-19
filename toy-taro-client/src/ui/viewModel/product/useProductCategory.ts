import { useEffect, useState } from 'react';
import { ProductCategoryController } from '@ui/controller';

interface Props {
  categoryId: string;
}

export function useProductCategory(props: Props) {
  const { categoryId } = props;

  const [productIdsForCategory, setProductListForCategory] = useState<string[]>(() => {
    return ProductCategoryController.getInstance().getProductIds(categoryId) ?? [];
  });

  useEffect(() => {
    const controller = ProductCategoryController.getInstance();
    const handleChange = () => setProductListForCategory(controller.getProductIds(categoryId));
    handleChange();
    controller.onProductListChange(categoryId, handleChange);
    return () => controller.offProductListChange(categoryId, handleChange);
  }, [categoryId]);

  return {
    productIds: productIdsForCategory,
  };
}
