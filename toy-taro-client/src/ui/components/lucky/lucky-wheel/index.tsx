import { forwardRef, useMemo } from 'react';
import { LuckyWheel as BaseLuckyWheel } from '@lucky-canvas/taro/react';
import { lightenColor } from '@shared/utils/color';
import { COLOR_VARIABLES } from '@shared/utils/constants';
import { LuckyRef, Prize } from '../types';
import { useLuckyAction } from '../useLuckyAction';
import { generateWheelColors, getImgSrc, pxGetter } from '../utils';

interface LuckyWheelProps {
  canvasId?: string;
  width?: number;
  disabledInnerAction?: boolean;
  spinDuration?: number;
  disabled?: boolean;
  prizes?: Array<Prize>;
  beforeStart?: () => boolean;
  onStart?: () => void;
  onEnd?: (info: { id: string; text: string; index: number }) => void;
  onError?: () => void;
}

const getColors = (baseColor: string) => {
  return {
    a01: baseColor,
    a02: lightenColor(baseColor, 0.5),
    a03: lightenColor(baseColor, 0.3),
    a04: lightenColor(baseColor, 0.1),
    a05: COLOR_VARIABLES.COLOR_WHITE,
  };
};

export const LuckyWheel = forwardRef<LuckyRef, LuckyWheelProps>((props, ref) => {
  const {
    canvasId,
    width = 300,
    prizes: _prizes = [],
    spinDuration = 3000,
    disabled = false,
    disabledInnerAction = false,
    beforeStart,
    onStart: _onStart,
    onEnd: _onEnd,
    onError,
  } = props;
  const px = useMemo(() => pxGetter(width), [width]);
  const colors = useMemo(() => getColors(COLOR_VARIABLES.COLOR_RED), []);
  const defaultStyle = useMemo(() => {
    return {
      background: colors.a01,
      fontColor: colors.a01,
      fontSize: px(14),
    };
  }, [colors, px]);
  const priceStyle = useMemo(() => {
    return {
      width: px(24),
      height: px(24),
    };
  }, [px]);
  const blockStyle = useMemo(() => {
    return {
      padding: px(8, true),
    };
  }, [px]);

  const blocks = useMemo(() => {
    return [{ background: colors.a01, ...blockStyle }];
  }, [colors, blockStyle]);

  const buttons = useMemo(() => {
    return [
      { radius: px(50), background: colors.a01 },
      { radius: px(45), background: COLOR_VARIABLES.COLOR_WHITE },
      {
        radius: px(40),
        background: colors.a02,
        pointer: true,
      },
      {
        radius: px(35),
        background: colors.a04,
        fonts: [
          {
            text: '开始\n抽奖',
            top: px(-20),
            fontColor: colors.a01,
            fontSize: px(16),
            fontWeight: 'bold',
          },
        ],
      },
    ];
  }, [colors, px]);
  const prizes = useMemo(() => {
    const prizeColors = generateWheelColors(_prizes.length, [colors.a03, colors.a04, colors.a05]);
    return _prizes.map((prize, index) => {
      return {
        __local: {
          id: prize.id,
          text: prize.text,
          range: prize.range,
          index,
        },
        fonts: [{ text: prize.text, top: '20%' }],
        background: prizeColors[index] ?? colors.a05,
        imgs: [{ src: getImgSrc(prize.type), top: '55%', ...priceStyle }],
      };
    });
  }, [_prizes, colors, priceStyle]);

  const {
    onStart,
    onEnd,
    ref: luckRef,
  } = useLuckyAction({
    disabled,
    disabledInnerAction,
    spinDuration,
    prizes,
    beforeStart,
    onStart: _onStart,
    onEnd: _onEnd,
    onError,
    outerRef: ref,
  });

  return (
    <BaseLuckyWheel
      ref={luckRef}
      canvasId={canvasId}
      width={width}
      height={width}
      defaultStyle={defaultStyle}
      blocks={blocks}
      prizes={prizes}
      buttons={buttons}
      onStart={onStart}
      onEnd={onEnd}
    />
  );
});
