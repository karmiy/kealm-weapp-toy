import { Fragment, useState } from 'react';
import { View } from '@tarojs/components';
import { TabPanel, Tabs, WhiteSpace } from '@ui/components';
import { TaskItem } from '../item';
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

  const tasks = [
    {
      title: '完成今日阅读任务',
      desc: '阅读一篇儿童故事并回答问题',
      score: 30,
      difficulty: 3,
      isPending: true,
    },
    {
      title: '完成数学练习',
      desc: '完成5道加减法题目',
      score: 20,
      difficulty: 2,
      isPending: false,
    },
    {
      title: '整理玩具',
      desc: '将房间里的玩具收拾整齐并分类摆放',
      score: 15,
      difficulty: 1,
      isPending: true,
    },
    {
      title: '跳绳100次',
      desc: '连续完成100次跳绳，不中断',
      score: 25,
      difficulty: 4,
      isPending: false,
    },
    {
      title: '画一幅画',
      desc: '使用彩色铅笔画一幅关于动物的画',
      score: 40,
      difficulty: 3,
      isPending: true,
    },
    {
      title: '背诵古诗一首',
      desc: '熟记并能完整背诵《静夜思》',
      score: 35,
      difficulty: 4,
      isPending: false,
    },
    {
      title: '帮忙洗碗',
      desc: '晚饭后主动帮忙洗碗并清理餐桌',
      score: 20,
      difficulty: 2,
      isPending: true,
    },
    {
      title: '制作一件手工作品',
      desc: '利用纸张和胶水制作一只纸鹤',
      score: 50,
      difficulty: 5,
      isPending: false,
    },
  ];

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
            <TabPanel key={type} label={type}>
              <View className={styles.tabPanelWrapper}>
                {tasks.map((task, index) => {
                  return (
                    <Fragment key={index}>
                      <TaskItem {...task} />
                      <WhiteSpace isVertical size='medium' />
                    </Fragment>
                  );
                })}
              </View>
            </TabPanel>
          );
        })}
      </Tabs>
    </View>
  );
};

export { TaskCategory };
