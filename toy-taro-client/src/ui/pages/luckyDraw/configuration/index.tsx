import { useEffect, useRef, useState } from 'react';
import { MovableArea, MovableView, Text, View } from '@tarojs/components';
import { nextTick } from '@tarojs/taro';
import { Button, Input } from '@ui/components';
import { FormItem, Layout } from '@ui/container';
import { DRAG_DIRECTION } from './constants';
import styles from './index.module.scss';

const ITEM_HEIGHT = 80; // 每个列表项的高度
const DRAG_THRESHOLD = ITEM_HEIGHT / 2; // 拖拽触发交换的阈值

export default function () {
  const [dragList, setDragList] = useState([
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' },
    { id: 4, text: 'Item 4' },
    { id: 5, text: 'Item 5' },
  ]);
  // 拖拽item的高度
  const dragItemHeight = useRef(40);
  // 起始y轴坐标
  const [startY, setStartY] = useState<number>(0);
  // 起始索引
  const [startIndex, setStartIndex] = useState<number>(0);
  // 结束索引
  const [endIndex, setEndIndex] = useState<number>(0);
  // 拖动项
  const [draging, setDraging] = useState<{
    status: boolean;
    direction: DRAG_DIRECTION;
    y: number;
    difference: number;
    transform: string;
  }>({
    status: false, // 状态 - 按下时设置为true,结束设置为false
    direction: DRAG_DIRECTION.UP, // 拖拽的方向
    y: 0, // 拖动时y轴的坐标
    difference: 0, // 拖拽时y轴坐标 -  按下时的坐标
    transform: '', // 存储拖拽的transform的值
  });

  /**
   * 获取item的高度
   */
  useEffect(() => {
    nextTick(() => {
      // const idStr = `#drag-${dragList[0][keyName]}`;
      // Taro.createSelectorQuery()
      //   .select(idStr)
      //   .boundingClientRect()
      //   .exec(res => {
      //     dragItemHeight.current = res[0].height;
      //   });
    });
  }, []);

  const onTouchStart = (e: any, item: any, index: number) => {
    const { pageY } = e.changedTouches[0];
    console.log('[test] onTouchStart', pageY);
    setDraging(prev => ({
      ...prev,
      status: true,
    }));
    setStartY(pageY);
    setStartIndex(index);
  };

  const onTouchMove = (e: any, item: any, index: number) => {
    const { pageY } = e.changedTouches[0];
    console.log('[test] onTouchMove', pageY);
    setDraging({
      status: true,
      direction: pageY > startY ? DRAG_DIRECTION.DOWN : DRAG_DIRECTION.UP,
      y: pageY,
      difference: pageY > startY ? pageY - startY : startY - pageY,
      transform: `translateY(${pageY > startY ? pageY - startY : '-' + (startY - pageY)}px)`,
    });
  };

  /**
   * 监听拖拽行属性的变化
   */
  useEffect(() => {
    if (!draging.status) {
      return;
    }
    computeNewIndex(draging.direction, draging.difference);
  }, [draging]);

  const computeNewIndex = (direction: DRAG_DIRECTION, difference: number) => {
    let newIndex;
    if (direction == DRAG_DIRECTION.UP) {
      newIndex = startIndex - Math.floor(difference / dragItemHeight.current);
    } else {
      newIndex = startIndex + Math.floor(difference / dragItemHeight.current);
      console.log('[test] computeNewIndex', {
        difference,
        itemHeight: dragItemHeight.current,
        newIndex,
      });
    }
    setEndIndex(newIndex);
  };

  const getTranslateY = (index: number) => {
    if (!draging.status) {
      return 'translateY(0px)';
    }
    if (index === startIndex) {
      return draging.transform;
    }
    if (draging.direction === DRAG_DIRECTION.UP) {
      if (index >= endIndex && index < startIndex) {
        return `translateY(100%)`;
      }
      return 'translateY(0px)';
    } else if (draging.direction === DRAG_DIRECTION.DOWN) {
      if (index <= endIndex && index > startIndex) {
        return `translateY(-100%)`;
      }
      return 'translateY(0px)';
    }
  };

  const onTouchEnd = (e: any, item: any, index: number) => {
    moveArrayItem();
    _reset();
  };

  /**
   * 更新列表
   */
  const moveArrayItem = () => {
    const newArray = [...dragList];
    const [removedItem] = newArray.splice(startIndex, 1);
    newArray.splice(endIndex, 0, removedItem);
    setDragList(newArray);
  };

  /**
   * 重置
   */
  const _reset = () => {
    setDraging({
      status: false,
      direction: DRAG_DIRECTION.UP,
      y: 0,
      difference: 0,
      transform: 'translateY(0px)',
    });
    setStartY(0);
    setStartIndex(0);
    setEndIndex(0);
  };

  return (
    <Layout type='card'>
      <FormItem title='祈愿池名称' required>
        <Input placeholder='请输入祈愿池名称' />
      </FormItem>
      <FormItem title='祈愿券' required>
        <Input placeholder='请输入所需祈愿券数量' type='number' />
      </FormItem>
      <View
        className={styles.dragSortList}
        style={{
          overflowY: draging.status ? 'hidden' : 'auto',
        }}
      >
        {dragList.map((item, index) => {
          return (
            <View
              key={item.id}
              className={styles.item}
              style={{
                backgroundColor: '#fff',
                zIndex: index === startIndex ? 10 : 1,
                transform: getTranslateY(index),
              }}
            >
              <View className='row-item'>
                <View
                  className='row-item__left'
                  onTouchStart={e => {
                    e.stopPropagation();
                    onTouchStart(e, item, index);
                  }}
                  onTouchMove={e => {
                    e.stopPropagation();
                    onTouchMove(e, item, index);
                  }}
                  onTouchEnd={e => {
                    e.stopPropagation();
                    onTouchEnd(e, item, index);
                  }}
                  catchMove
                >
                  <Text>{item.text}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
      <Button width='100%' type='primary' size='large'>
        保存
      </Button>
    </Layout>
  );
}
