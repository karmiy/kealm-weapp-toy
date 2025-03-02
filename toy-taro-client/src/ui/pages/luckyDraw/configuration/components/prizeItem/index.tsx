import { PrizeItem as StyledPrizeItem } from '@ui/container';
import { usePrizeItem } from '@ui/viewModel';
import styles from './index.module.scss';

export interface PrizeItemProps {
  id: string;
  range?: number;
  totalRange?: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const PrizeItem = (props: PrizeItemProps) => {
  const { id, range, totalRange, onEdit, onDelete } = props;
  const prize = usePrizeItem(id);

  if (!prize) {
    return null;
  }

  return (
    <StyledPrizeItem
      gray
      type={prize.type}
      prizeTitle={prize.title}
      prizeDesc={prize.detailDesc}
      range={range}
      totalRange={totalRange}
      editable
      deletable
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
};
