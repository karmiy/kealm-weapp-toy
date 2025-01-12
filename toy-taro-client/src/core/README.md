## Test Code

```ts
import { STORE_NAME, storeManager } from '@core';
import { Logger } from '@/utils/logger';

storeManager.subscribe(STORE_NAME.TOY, () => {
  Logger.getLogger('[test]').info('toy subscribe');
});

storeManager.subscribe(STORE_NAME.USER, () => {
  Logger.getLogger('[test]').info('user subscribe');
});

Logger.getLogger('[test]').info('toy ids', storeManager.getIds(STORE_NAME.TOY));
Logger.getLogger('[test]').info('user ids', storeManager.getIds(STORE_NAME.USER));
Logger.getLogger('[test]').info('get toys', storeManager.get(STORE_NAME.TOY));
Logger.getLogger('[test]').info('get user', storeManager.get(STORE_NAME.USER));
Logger.getLogger('[test]').info('---------------------------');

storeManager.subscribeById(STORE_NAME.TOY, '1', () => {
  Logger.getLogger('[test]').info('toy subscribe by id1');
});
storeManager.subscribeById(STORE_NAME.TOY, '2', () => {
  Logger.getLogger('[test]').info('toy subscribe by id2');
});
storeManager.subscribeById(STORE_NAME.TOY, '3', () => {
  Logger.getLogger('[test]').info('toy subscribe by id3');
});

storeManager.refresh(STORE_NAME.TOY, [
  { id: '1', name: 'name1', desc: 'desc1' },
  { id: '2', name: 'name2', desc: 'desc2' },
]);
storeManager.refresh(STORE_NAME.USER, { id: '1', name: 'name1' });
Logger.getLogger('[test]').info('---------------------------');
Logger.getLogger('[test]').info('get toy1', storeManager.getById(STORE_NAME.TOY, '1'));
Logger.getLogger('[test]').info('get toy2', storeManager.getById(STORE_NAME.TOY, '2'));
Logger.getLogger('[test]').info('get toy3', storeManager.getById(STORE_NAME.TOY, '3'));
Logger.getLogger('[test]').info('get user', storeManager.getById(STORE_NAME.USER, '1'));

Logger.getLogger('[test]').info('---------------------------');
storeManager.emitUpdate(STORE_NAME.TOY, {
  entities: [
    {
      id: '1',
      name: 'name11',
      desc: 'desc11',
    },
    {
      id: '3',
      name: 'name3',
      desc: 'desc3',
    },
  ],
  partials: [
    {
      id: '2',
      name: 'name22',
    },
  ],
});
storeManager.emitUpdate(STORE_NAME.USER, {
  entities: [
    {
      id: '1',
      name: 'name11',
    },
  ],
});
Logger.getLogger('[test]').info('get toy1', storeManager.getById(STORE_NAME.TOY, '1'));
Logger.getLogger('[test]').info('get toy2', storeManager.getById(STORE_NAME.TOY, '2'));
Logger.getLogger('[test]').info('get toy3', storeManager.getById(STORE_NAME.TOY, '3'));
Logger.getLogger('[test]').info('get user', storeManager.get(STORE_NAME.USER));

Logger.getLogger('[test]').info('---------------------------');
storeManager.emitDelete(STORE_NAME.TOY, ['2']);
Logger.getLogger('[test]').info('toy ids', storeManager.getIds(STORE_NAME.TOY));
Logger.getLogger('[test]').info('get toy2', storeManager.getById(STORE_NAME.TOY, '2'));

Logger.getLogger('[test]').info('---------------------------');
storeManager.emitDelete(STORE_NAME.USER);
Logger.getLogger('[test]').info('user ids', storeManager.getIds(STORE_NAME.USER));
```