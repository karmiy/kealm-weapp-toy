import { useState } from 'react';
import { View } from '@tarojs/components';
import { TASK_TYPE } from '@core';
import { TabPanel, Tabs } from '@ui/components';
import { useTaskCategoryList } from '@ui/viewModel';
import { TaskList } from '../taskList';
import styles from './index.module.scss';

interface TaskCategoryProps {
  type: TASK_TYPE;
}

const TaskCategory = (props: TaskCategoryProps) => {
  const { type } = props;
  const [current, setCurrent] = useState(0);
  // const categoryList = useStoreList(STORE_NAME.TASK_CATEGORY);
  const { categoryList } = useTaskCategoryList({ type });

  return (
    <View className={styles.wrapper}>
      <Tabs
        className={styles.tabs}
        current={current}
        onChange={setCurrent}
        variant='text'
        mode='vertical'
      >
        {categoryList.map(item => {
          return (
            <TabPanel key={item.id} label={item.name}>
              <TaskList type={type} categoryId={item.id} />
            </TabPanel>
          );
        })}
      </Tabs>
    </View>
  );
};

export { TaskCategory };
