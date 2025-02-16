import { useMemo } from 'react';
import { LuckyGrid as BaseLuckyGrid } from '@lucky-canvas/taro/react';
import { lightenColor } from '@shared/utils/color';
import { COLOR_VARIABLES } from '@shared/utils/constants';
import { Prize } from '../types';
import { useLuckyAction } from '../useLuckyAction';
import { generateBoundaryCoords, generateSpiralCoords, getImgSrc, pxGetter } from '../utils';

interface LuckyGridProps {
  canvasId?: string;
  width?: number;
  spinDuration?: number;
  disabled?: boolean;
  prizes?: Array<Prize>;
  onEnd?: (id: string, text: string) => void;
}

interface PrizeConfig {
  rows: number;
  cols: number;
  height: (width: number) => number;
  prize: {
    position: { x: number; y: number }[];
    font: { top: string; fontSize: number };
    img: { width: number; height: number; top: string };
  };
  button: {
    x: number;
    y: number;
    width: string;
    height: string;
    top: string;
    col: number;
    row: number;
  };
}

const getColors = (baseColor: string) => {
  return {
    a01: baseColor,
    a02: lightenColor(baseColor, 0.4),
    a03: lightenColor(baseColor, 0.2),
  };
};

const defaultConfig = {
  speed: 15,
};

const layoutConfigMap = new Map<number, PrizeConfig>([
  [
    8,
    {
      rows: 3,
      cols: 3,
      height: (width: number) => width,
      prize: {
        position: generateBoundaryCoords(3, 3),
        font: { top: '60%', fontSize: 14 },
        img: { width: 40, height: 40, top: '10%' },
      },
      button: { x: 1, y: 1, width: '150%', height: '150%', top: '-25%', col: 1, row: 1 },
    },
  ],
  [
    11,
    {
      rows: 3,
      cols: 4,
      height: (width: number) => (width * 3) / 4,
      prize: {
        position: generateSpiralCoords(3, 4).slice(0, -1),
        font: { top: '60%', fontSize: 12 },
        img: { width: 30, height: 30, top: '10%' },
      },
      button: { x: 2, y: 1, width: '150%', height: '150%', top: '-25%', col: 1, row: 1 },
    },
  ],
  [
    15,
    {
      rows: 4,
      cols: 4,
      height: (width: number) => width,
      prize: {
        position: generateSpiralCoords(4, 4).slice(0, -1),
        font: { top: '60%', fontSize: 12 },
        img: { width: 30, height: 30, top: '10%' },
      },
      button: { x: 1, y: 2, width: '150%', height: '150%', top: '-25%', col: 1, row: 1 },
    },
  ],
  [
    19,
    {
      rows: 4,
      cols: 5,
      height: (width: number) => (width * 4) / 5,
      prize: {
        position: generateSpiralCoords(4, 5).slice(0, -1),
        font: { top: '55%', fontSize: 10 },
        img: { width: 24, height: 24, top: '6%' },
      },
      button: { x: 1, y: 2, width: '150%', height: '150%', top: '-25%', col: 1, row: 1 },
    },
  ],
  [
    24,
    {
      rows: 5,
      cols: 5,
      height: (width: number) => width,
      prize: {
        position: generateSpiralCoords(5, 5),
        font: { top: '55%', fontSize: 10 },
        img: { width: 24, height: 24, top: '6%' },
      },
      button: { x: 2, y: 2, width: '150%', height: '150%', top: '-25%', col: 1, row: 1 },
    },
  ],
]);

const getLayoutConfig = (prizeCount: number) => {
  const config = [...layoutConfigMap.entries()].find(([count]) => {
    return prizeCount <= count;
  });
  if (!config) {
    return [...layoutConfigMap.values()].reverse()[0];
  }
  return layoutConfigMap.get(config[0])!;
};

export function LuckyGrid(props: LuckyGridProps) {
  const {
    canvasId,
    width = 300,
    spinDuration = 5000,
    disabled = false,
    prizes: _prizes = [],
    onEnd: _onEnd,
  } = props;
  const px = useMemo(() => pxGetter(width), [width]);
  const colors = useMemo(() => getColors(COLOR_VARIABLES.COLOR_RED), []);
  const layoutConfig = useMemo(() => getLayoutConfig(_prizes.length), [_prizes.length]);
  const defaultStyle = useMemo(() => {
    return {
      background: colors.a03,
      fontColor: colors.a01,
    };
  }, [colors.a01, colors.a03]);

  const activeStyle = useMemo(() => {
    return {
      background: colors.a02,
    };
  }, [colors.a02]);

  const height = useMemo(() => layoutConfig.height(width), [layoutConfig, width]);

  const blocks = useMemo(() => {
    return [
      { padding: px(8, true), background: colors.a01, borderRadius: px(36) },
      { padding: px(8, true), background: COLOR_VARIABLES.COLOR_WHITE, borderRadius: px(28) },
    ];
  }, [colors.a01, px]);

  const prizes = useMemo(() => {
    return _prizes.map((prize, index) => {
      const position = layoutConfig.prize.position[index];
      const font = layoutConfig.prize.font;
      const img = layoutConfig.prize.img;
      return {
        __local: {
          id: prize.id,
          text: prize.text,
          range: prize.range,
        },
        ...position,
        imgs: [{ src: getImgSrc(prize.type), width: img.width, height: img.height, top: img.top }],
        fonts: [{ text: prize.text, top: font.top, fontSize: px(font.fontSize) }],
      };
    });
  }, [_prizes, layoutConfig, px]);

  const buttons = useMemo(() => {
    const buttonConfig = layoutConfig.button;
    return [
      {
        x: buttonConfig.x,
        y: buttonConfig.y,
        col: buttonConfig.col,
        row: buttonConfig.row,
        background: 'transparent',
        imgs: [
          {
            src: 'https://gitee.com/karmiy/static/raw/master/weapp-toy/imgs/lucky-grid-lottery.png',
            width: buttonConfig.width,
            height: buttonConfig.height,
            top: buttonConfig.top,
          },
        ],
      },
    ];
  }, [layoutConfig]);

  const { onStart, onEnd, ref } = useLuckyAction({
    disabled,
    spinDuration,
    prizes,
    onEnd: _onEnd,
  });

  return (
    <BaseLuckyGrid
      ref={ref}
      canvasId={canvasId}
      width={width}
      height={height}
      rows={layoutConfig.rows}
      cols={layoutConfig.cols}
      defaultStyle={defaultStyle}
      activeStyle={activeStyle}
      defaultConfig={defaultConfig}
      blocks={blocks}
      prizes={prizes}
      buttons={buttons}
      onStart={onStart}
      onEnd={onEnd}
    />
  );
}
