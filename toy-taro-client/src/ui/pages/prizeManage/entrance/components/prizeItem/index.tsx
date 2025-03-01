import { PrizeItem as StyledPrizeItem } from '@ui/container';
import { usePrizeItem } from '@ui/viewModel';
import styles from './index.module.scss';

interface PrizeItemProps {
  id?: string;
}

export const PrizeItem = (props: PrizeItemProps) => {
  const { id } = props;
  const prize = usePrizeItem(id);

  if (!prize) {
    return null;
  }

  return (
    <StyledPrizeItem
      classes={{
        root: styles.prizeItemWrapper,
      }}
      transparent
      type={prize.type}
      prizeTitle={prize.title}
      prizeDesc={prize.detailDesc}
      editable={false}
      deletable={false}
    />
  );
};
