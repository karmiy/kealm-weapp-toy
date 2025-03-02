import { useMemo } from 'react';
import { LuckyWheel as BaseLuckyWheel } from '@lucky-canvas/taro/react';
import { lightenColor } from '@shared/utils/color';
import { COLOR_VARIABLES } from '@shared/utils/constants';
import { Prize } from '../types';
import { useLuckyAction } from '../useLuckyAction';
import { generateWheelColors, getImgSrc, pxGetter } from '../utils';

interface LuckyWheelProps {
  canvasId?: string;
  width?: number;
  spinDuration?: number;
  disabled?: boolean;
  prizes?: Array<Prize>;
  onEnd?: (id: string, text: string) => void;
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

export function LuckyWheel(props: LuckyWheelProps) {
  const {
    canvasId,
    width = 300,
    prizes: _prizes = [],
    spinDuration = 3000,
    disabled = false,
    onEnd: _onEnd,
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
        },
        fonts: [{ text: prize.text, top: '25%' }],
        background: prizeColors[index] ?? colors.a05,
        imgs: [{ src: getImgSrc(prize.type), top: '50%', ...priceStyle }],
      };
    });
  }, [_prizes, colors, priceStyle]);

  const { onStart, onEnd, ref } = useLuckyAction({
    disabled,
    spinDuration,
    prizes,
    onEnd: _onEnd,
  });

  return (
    <BaseLuckyWheel
      ref={ref}
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
}
