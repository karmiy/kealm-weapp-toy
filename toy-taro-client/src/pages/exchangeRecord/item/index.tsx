import { useMemo, useState } from 'react';
import { Text, View } from '@tarojs/components';
import { OsModal } from 'ossaui';
import { Button } from '@/components';
import { ToyCard } from '@/container';
import { dialogManager } from '@/manager';
import styles from './index.module.scss';

interface ItemProps {
  title: string;
  coverImage: string;
  currentScore: number;
  originalScore?: number;
  test?: boolean;
}

const Item = (props: ItemProps) => {
  const { title, coverImage, currentScore, originalScore, test } = props;
  const [showConfirm, setShowConfirm] = useState(false);

  const subTitle = useMemo(() => {
    return (
      <View className={styles.subTitle}>
        <Text>
          30cm 粉色30cm 粉色30cm 粉色30cm 粉色30cm 粉色30cm 粉色30cm 粉色30cm 粉色30cm 粉色30cm
          粉色30cm 粉色30cm 粉色
        </Text>
        <Text>兑换时间: 2014-01-01</Text>
      </View>
    );
  }, []);
  return (
    <View className={styles.wrapper}>
      <ToyCard
        className={styles.card}
        mode='horizontal'
        paddingSize='none'
        title={title}
        subTitle={subTitle}
        coverImage={coverImage}
        currentScore={currentScore}
        originalScore={originalScore}
        action={
          <Button
            size='small'
            type='plain'
            onClick={() =>
              dialogManager.open({
                id: 'test1',
                title: '提示',
                cancelText: '取消',
                confirmText: '确认',
                content: '您确定要撤销兑换这件商品吗？撤销后请与管理员联系处理归还事宜',
                closeable: false,
              })
            }
          >
            撤销
          </Button>
        }
      />
      {/* <OsModal
        title='提示'
        cancelText='取消'
        confirmText='确定'
        content='您确定要撤销兑换这件商品吗？撤销后请与管理员联系处理归还事宜'
        isShow={showConfirm}
        closeable={false}
        onCancel={() => setShowConfirm(false)}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => setShowConfirm(false)}
      /> */}
      {/* {test ? (
        <View
          style={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            zIndex: 9999999,
            backgroundColor: 'green',
            opacity: 0.3,
          }}
        />
      ) : null} */}
    </View>
  );
};

export { Item };
