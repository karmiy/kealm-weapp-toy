import { useCallback, useRef } from 'react';
import { showToast } from '@shared/utils/operateFeedback';
import { sleep } from '@shared/utils/utils';
import { weightedRandomIndex } from './utils';

interface Prize {
  __local: {
    id: string;
    text: string;
    range: number;
  };
}

interface Props {
  disabled?: boolean;
  spinDuration: number;
  prizes?: Prize[];
  onEnd?: (id: string, text: string) => void;
}

export function useLuckyAction(props: Props) {
  const myLucky = useRef<{ play: () => void; stop: (idx?: number) => void }>(null);
  const { disabled = false, spinDuration, prizes = [], onEnd: _onEnd } = props;
  const isSpinning = useRef(false);
  const onStart = useCallback(async () => {
    if (disabled || isSpinning.current || !prizes.length) return;
    isSpinning.current = true;
    myLucky.current?.play();

    await sleep(spinDuration);
    const index = weightedRandomIndex(prizes.map(prize => ({ range: prize.__local.range })));
    myLucky.current?.stop(index);
    isSpinning.current = false;
  }, [disabled, spinDuration, prizes]);

  const onEnd = useCallback(
    (prize: Prize) => {
      if (!prize.__local) {
        showToast({
          title: '抽奖过程中出现异常，请联系管理员',
        });
        return;
      }
      const { id, text } = prize.__local;
      _onEnd?.(id, text);
    },
    [_onEnd],
  );

  return {
    onStart,
    onEnd,
    ref: myLucky,
  };
}
