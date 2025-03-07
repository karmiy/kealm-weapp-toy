import { useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { showToast } from '@shared/utils/operateFeedback';
import { sleep } from '@shared/utils/utils';
import { LuckyRef } from './types';
import { weightedRandomIndex } from './utils';

interface Prize {
  __local: {
    id: string;
    text: string;
    range: number;
    index: number;
  };
}

interface Props {
  disabled?: boolean;
  spinDuration: number;
  prizes?: Prize[];
  disabledInnerAction?: boolean;
  beforeStart?: () => boolean;
  onStart?: () => void;
  onEnd?: (info: { id: string; text: string; index: number }) => void;
  onError?: () => void;
  outerRef?: React.ForwardedRef<LuckyRef>;
}

export function useLuckyAction(props: Props) {
  const myLucky = useRef<{ play: () => void; stop: (idx?: number) => void }>(null);
  const {
    disabled = false,
    disabledInnerAction = false,
    spinDuration,
    prizes = [],
    beforeStart,
    onStart: _onStart,
    onEnd: _onEnd,
    onError,
    outerRef,
  } = props;
  const isSpinning = useRef(false);

  const checkStartPermission = useCallback(() => {
    return !disabled && !isSpinning.current && !!prizes.length && (beforeStart?.() ?? true);
  }, [disabled, prizes.length, beforeStart]);

  useImperativeHandle(outerRef, () => ({
    play: (checkPermission?: boolean) => {
      if (checkPermission && !checkStartPermission()) return;

      isSpinning.current = true;
      myLucky.current?.play();
    },
    stop: (index: number) => {
      myLucky.current?.stop(index);
    },
  }));

  const onStart = useCallback(async () => {
    if (!checkStartPermission()) return;

    _onStart?.();
    if (disabledInnerAction) return;
    isSpinning.current = true;
    myLucky.current?.play();

    await sleep(spinDuration);
    const index = weightedRandomIndex(prizes.map(prize => ({ range: prize.__local.range })));
    myLucky.current?.stop(index);
  }, [checkStartPermission, _onStart, spinDuration, prizes, disabledInnerAction]);

  const onEnd = useCallback(
    (prize: Prize) => {
      isSpinning.current = false;
      if (!prize.__local) {
        showToast({
          title: '抽奖过程中出现异常，请联系管理员',
        });
        onError?.();
        return;
      }
      const { id, text, index } = prize.__local;
      _onEnd?.({ id, text, index });
    },
    [_onEnd, onError],
  );

  return {
    onStart,
    onEnd,
    ref: myLucky,
  };
}
