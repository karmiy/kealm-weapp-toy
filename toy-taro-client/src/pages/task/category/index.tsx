import { useState } from 'react';
import { View } from '@tarojs/components';
import { TabPanel, Tabs } from '@/components';
import styles from './index.module.scss';

const TaskCategory = () => {
  const [current, setCurrent] = useState(0);
  const [typeList, setTypeList] = useState([
    '学习', // Study
    '运动', // Exercise
    '生活', // Life
    '兴趣', // Hobbies
    '工作', // Work
    '健康', // Health
    '社交', // Social
    '环保', // Environmental
    '志愿服务', // Volunteering
    '技能提升', // Skill Development
    '旅行', // Travel
    '财务', // Finance
    '创造', // Creativity
    '休息', // Relaxation
    '自我提升', // Self-Improvement
  ]);
  return (
    <View className={styles.wrapper}>
      <Tabs
        className={styles.tabs}
        current={current}
        onChange={setCurrent}
        variant='text'
        mode='vertical'
      >
        {typeList.map(type => {
          return (
            <TabPanel key={type} label={type} className='vvvv'>
              <View style={{ height: 600, border: '1px solid #ff69b4' }}>content</View>
            </TabPanel>
          );
        })}
      </Tabs>
    </View>
  );
};

export { TaskCategory };
