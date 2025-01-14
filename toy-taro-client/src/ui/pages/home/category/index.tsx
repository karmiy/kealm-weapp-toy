import { useState } from 'react';
import { STORE_NAME } from '@core';
import { TabPanel, Tabs, WhiteSpace } from '@ui/components';
import { useStoreList } from '@ui/viewModel';
import { ToyList } from './toyList';
import styles from './index.module.scss';

const Category = () => {
  const list = useStoreList(STORE_NAME.TOY_CATEGORY);
  const [current, setCurrent] = useState(0);
  return (
    <>
      <Tabs current={current} onChange={setCurrent}>
        {list.map(item => {
          const { id, name } = item;
          return (
            <TabPanel key={id} label={name}>
              <ToyList categoryId={id} />
            </TabPanel>
          );
        })}
      </Tabs>
      <WhiteSpace size='large' />
    </>
  );
};

export { Category };
