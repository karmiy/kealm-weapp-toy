import { createSelectorQuery } from '@tarojs/taro';

export const getScrollOffset = async (options: {
  component?: TaroGeneral.IAnyObject;
  className: string;
}): Promise<{
  scrollHeight: number;
  scrollLeft: number;
  scrollTop: number;
  scrollWidth: number;
}> => {
  const { component, className } = options;
  const selectorQuery = !component ? createSelectorQuery() : createSelectorQuery().in(component);
  selectorQuery.select(`.${className}`).scrollOffset();
  return new Promise(resolve => {
    selectorQuery.exec(([res]) => {
      const { scrollHeight, scrollLeft, scrollTop, scrollWidth } = res;
      resolve({
        scrollHeight,
        scrollLeft,
        scrollTop,
        scrollWidth,
      });
    });
  });
};

// 只用与 ScrollView
export const scrollTo = async (options: {
  component?: TaroGeneral.IAnyObject;
  className: string;
  animated?: boolean;
  duration?: number;
  left?: number;
  top?: number;
}): Promise<void> => {
  const { component, className, animated = true, duration, left, top } = options;
  const selectorQuery = !component ? createSelectorQuery() : createSelectorQuery().in(component);
  selectorQuery
    .select(`.${className}`)
    .node()
    .exec(([res]) => {
      res.node.scrollTo({
        duration,
        top,
        left,
        animated,
      });
    });
};

export interface Rect {
  width: number;
  height: number;
  left: number;
  top: number;
  right: number;
  bottom: number;
}

function getBoundingClientRect(options: {
  component?: TaroGeneral.IAnyObject;
  className: string;
  selectAll: true;
}): Promise<Rect[]>;
function getBoundingClientRect(options: {
  component?: TaroGeneral.IAnyObject;
  className: string;
  selectAll?: false | undefined;
}): Promise<Rect>;
async function getBoundingClientRect(options: {
  component?: TaroGeneral.IAnyObject;
  className: string;
  selectAll?: boolean;
}) {
  const { component, className, selectAll } = options;
  const selectorQuery = !component ? createSelectorQuery() : createSelectorQuery().in(component);
  const query = selectAll
    ? selectorQuery.selectAll(`.${className}`)
    : selectorQuery.select(`.${className}`);
  return new Promise(resolve => {
    query
      .boundingClientRect(res => {
        if (Array.isArray(res)) {
          resolve(
            res.map(item => {
              const { width, height, left, top, bottom, right } = item;
              return {
                width,
                height,
                left,
                top,
                bottom,
                right,
              };
            }),
          );
          return;
        }
        const { width, height, left, top, bottom, right } = res;
        resolve({
          width,
          height,
          left,
          top,
          bottom,
          right,
        });
      })
      .exec();
  });
}

export { getBoundingClientRect };
