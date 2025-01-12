import isEqual from 'lodash/isEqual';
import { Undefinable } from '@shared/types';
import { Logger } from '@shared/utils/logger';
import { toCamelCase } from '@shared/utils/utils';
import { HANDLER_TYPE, STORE_NAME } from './constants';
import { ToyModel, UserModel } from './model';

interface Entity {
  id: string;
}

interface Model {
  id: string;
}

type ModelConstruct = { new (entity: Entity): Model };

type InstanceEntity<
  C extends Record<STORE_NAME, { model: ModelConstruct }>,
  T extends STORE_NAME,
> = ConstructorParameters<C[T]['model']>[number];

type PartialEntity<E> = Partial<E> & { id: string };

class StoreManager<
  C extends Record<
    STORE_NAME,
    {
      type: HANDLER_TYPE;
      model: ModelConstruct;
      sortValue: (a: InstanceType<ModelConstruct>, b: InstanceType<ModelConstruct>) => number;
    }
  >,
> {
  private _config: C;
  private _singleStores = new Map<STORE_NAME, Model>();
  private _multiStores = new Map<STORE_NAME, Map<string, Model>>();
  private _sortIdsStores = new Map<STORE_NAME, string[]>();
  private _subscriptions = new Map<STORE_NAME, Set<() => void>>();
  private _idListSubscriptions = new Map<STORE_NAME, Set<() => void>>();
  private _idSubscriptions = new Map<STORE_NAME, Map<string, Set<() => void>>>();

  private get _logger() {
    return Logger.getLogger('[StoreManager]');
  }

  constructor(config: C) {
    this._config = config;
    for (const key in config) {
      const modelName = key as STORE_NAME;
      if (config[modelName].type === HANDLER_TYPE.SINGLE) {
        return;
      }
      this._multiStores.set(modelName, new Map());
    }
  }

  refresh<T extends STORE_NAME>(
    storeName: T,
    payload: C[T]['type'] extends HANDLER_TYPE.MULTIPLE
      ? InstanceEntity<C, T>[]
      : InstanceEntity<C, T>,
  ) {
    const { model: ModelConstructor, type } = this._config[storeName] ?? {};
    if (!ModelConstructor) throw new Error(`[refresh]ModelConstructor for ${storeName} not found`);

    if (type === HANDLER_TYPE.MULTIPLE) {
      const prevIds = this.getIds(storeName);
      if (!Array.isArray(payload)) {
        throw new Error(`[refresh]Payload for ${storeName} must be an array for type MULTIPLE`);
      }
      const store = this._multiStores.get(storeName);
      if (!store) {
        throw new Error(`[refresh]Store for ${storeName} not found`);
      }
      payload.forEach(entity => {
        const model = new ModelConstructor(entity);
        store.set(model.id, model);

        this._notifyIdSubscribers(storeName, model.id);
      });

      this._notifySubscribers(storeName);
      const currentIds = this.getIds(storeName);
      !isEqual(currentIds, prevIds) && this._notifyIdListSubscribers(storeName);
    } else if (type === HANDLER_TYPE.SINGLE) {
      if (Array.isArray(payload)) {
        throw new Error(`[refresh]Payload for ${storeName} must not be an array for type SINGLE`);
      }
      const prevModel = this._singleStores.get(storeName);
      const model = new ModelConstructor(payload);
      this._singleStores.set(storeName, model);

      this._notifyIdSubscribers(storeName, model.id);
      this._notifySubscribers(storeName);
      prevModel?.id !== model.id && this._notifyIdListSubscribers(storeName);
    }
  }

  get<T extends STORE_NAME>(
    storeName: T,
  ): C[T]['type'] extends HANDLER_TYPE.MULTIPLE
    ? Map<string, InstanceType<C[T]['model']>>
    : Undefinable<InstanceType<C[T]['model']>> {
    const config = this._config[storeName];
    if (!config) throw new Error(`[get]Configuration for ${storeName} not found`);

    if (config.type === HANDLER_TYPE.MULTIPLE) {
      const store = this._multiStores.get(storeName);
      return store as C[T]['type'] extends HANDLER_TYPE.MULTIPLE
        ? Map<string, InstanceType<C[T]['model']>>
        : never;
    } else if (config.type === HANDLER_TYPE.SINGLE) {
      const store = this._singleStores.get(storeName);
      return store as C[T]['type'] extends HANDLER_TYPE.SINGLE
        ? Undefinable<InstanceType<C[T]['model']>>
        : never as any;
    }
    throw new Error(`[get]Unknown type for ${storeName}`);
  }

  getById<T extends STORE_NAME>(
    storeName: T,
    id: string,
  ): Undefinable<InstanceType<C[T]['model']>> {
    const config = this._config[storeName];
    if (!config) {
      throw new Error(`[getById]Configuration for ${storeName} not found`);
    }

    if (config.type === HANDLER_TYPE.MULTIPLE) {
      const store = this._multiStores.get(storeName);
      if (!store) {
        throw new Error(`[getById]Store for ${storeName} not found`);
      }
      return store.get(id) as Undefinable<InstanceType<C[T]['model']>>;
    } else if (config.type === HANDLER_TYPE.SINGLE) {
      const model = this._singleStores.get(storeName);
      if (!model) {
        throw new Error(`[getById]Model for ${storeName} not found`);
      }
      return model as Undefinable<InstanceType<C[T]['model']>>;
    }

    throw new Error(`[getById]Unknown type for ${storeName}`);
  }

  getIds<T extends STORE_NAME>(storeName: T) {
    const config = this._config[storeName];
    if (!config) {
      // throw new Error(`[getIds]Configuration for ${storeName} not found`);
      return [];
    }

    if (config.type === HANDLER_TYPE.MULTIPLE) {
      const store = this._multiStores.get(storeName);
      return store ? Array.from(store.keys()) : [];
    } else if (config.type === HANDLER_TYPE.SINGLE) {
      const store = this._singleStores.get(storeName);
      return store ? [store.id] : [];
    }

    // throw new Error(`[getIds]Unknown type for ${storeName}`);
    return [];
  }

  getSortIds<T extends STORE_NAME>(storeName: T) {
    return this._sortIdsStores.get(storeName) ?? [];
  }

  subscribe(storeName: STORE_NAME, callback: () => void) {
    const subscribes = this._subscriptions.get(storeName) ?? new Set();
    subscribes.add(callback);
    this._subscriptions.set(storeName, subscribes);
  }

  unsubscribe(storeName: STORE_NAME, callback: () => void) {
    const storeSubscriptions = this._subscriptions.get(storeName);
    if (storeSubscriptions) {
      storeSubscriptions.delete(callback);
    }
  }

  subscribeIdList(storeName: STORE_NAME, callback: () => void) {
    const subscribes = this._idListSubscriptions.get(storeName) ?? new Set();
    subscribes.add(callback);
    this._idListSubscriptions.set(storeName, subscribes);
  }

  unsubscribeIdList(storeName: STORE_NAME, callback: () => void) {
    const storeSubscriptions = this._idListSubscriptions.get(storeName);
    if (storeSubscriptions) {
      storeSubscriptions.delete(callback);
    }
  }

  subscribeById(storeName: STORE_NAME, id: string, callback: () => void) {
    if (!this._idSubscriptions.has(storeName)) {
      this._idSubscriptions.set(storeName, new Map());
    }
    const idSubscriptions = this._idSubscriptions.get(storeName)!;
    if (!idSubscriptions.has(id)) {
      idSubscriptions.set(id, new Set());
    }
    idSubscriptions.get(id)!.add(callback);
  }

  unsubscribeById(storeName: STORE_NAME, id: string, callback: () => void) {
    const idSubscriptions = this._idSubscriptions.get(storeName);
    if (idSubscriptions) {
      const callbacks = idSubscriptions.get(id);
      if (callbacks) {
        callbacks.delete(callback);
      }
    }
  }

  private _notifySubscribers(storeName: STORE_NAME) {
    const storeSubscriptions = this._subscriptions.get(storeName);
    if (storeSubscriptions) {
      storeSubscriptions.forEach(callback => {
        callback();
      });
    }
  }

  private _notifyIdListSubscribers(storeName: STORE_NAME) {
    const config = this._config[storeName];
    if (!config) {
      throw new Error(`[_notifyIdListSubscribers]Configuration for ${storeName} not found`);
    }

    const { sortValue } = config;
    const ids = [...this.getIds(storeName)];
    ids.sort((a, b) => {
      const aModel = this.getById(storeName, a);
      const bModel = this.getById(storeName, b);
      if (!aModel || !bModel) {
        throw new Error(
          `[_notifyIdListSubscribers]sort id list failed for ${storeName}: hasAModel: ${!!aModel}, hasBModel: ${!!bModel}`,
        );
      }
      return sortValue(aModel, bModel);
    });
    this._sortIdsStores.set(storeName, ids);

    const storeSubscriptions = this._idListSubscriptions.get(storeName);
    if (storeSubscriptions) {
      storeSubscriptions.forEach(callback => {
        callback();
      });
    }
  }

  private _notifyIdSubscribers(storeName: STORE_NAME, id: string) {
    const idSubscriptions = this._idSubscriptions.get(storeName);
    if (idSubscriptions) {
      const callbacks = idSubscriptions.get(id);
      if (callbacks) {
        callbacks.forEach(callback => {
          callback();
        });
      }
    }
  }

  private _mixinModel<T extends Model, E extends Entity>(model: T, partial: E) {
    let hasChange = false;
    for (const key in partial) {
      const modelKey = toCamelCase(key);
      if (modelKey in model) {
        const currentValue = model[modelKey];
        const updateValue = partial[key];
        if (isEqual(currentValue, updateValue)) {
          continue;
        }
        hasChange = true;
        model[modelKey] = partial[key];
      }
    }
    return { model, hasChange };
  }

  emitUpdate<T extends STORE_NAME>(
    storeName: T,
    payload: {
      entities?: InstanceEntity<C, T>[];
      partials?: PartialEntity<InstanceEntity<C, T>>[];
    },
  ) {
    const { model: ModelConstructor, type } = this._config[storeName] ?? {};
    if (!ModelConstructor) {
      throw new Error(`[emitUpdate]ModelConstructor for ${storeName} not found`);
    }
    const prevIds = this.getIds(storeName);
    const { entities, partials } = payload;

    if (entities) {
      if (type === HANDLER_TYPE.MULTIPLE) {
        const store = this._multiStores.get(storeName);
        if (!store) throw new Error(`[emitUpdate]Store for ${storeName} not found`);

        entities.forEach(entity => {
          const model = new ModelConstructor(entity);
          store.set(model.id, model);
          this._notifyIdSubscribers(storeName, model.id);
        });
      } else if (type === HANDLER_TYPE.SINGLE) {
        const model = new ModelConstructor(entities[0]);
        this._singleStores.set(storeName, model);
        this._notifyIdSubscribers(storeName, model.id);
      }
    }

    if (partials) {
      if (type === HANDLER_TYPE.MULTIPLE) {
        const store = this._multiStores.get(storeName);
        if (!store) throw new Error(`[emitUpdate]Store for ${storeName} not found`);

        partials.forEach(partial => {
          const model = store.get(partial.id as string);
          if (model) {
            const { hasChange } = this._mixinModel(model, partial);
            store.set(model.id, model);
            hasChange && this._notifyIdSubscribers(storeName, model.id);
          }
        });
      } else if (type === HANDLER_TYPE.SINGLE) {
        const model = this._singleStores.get(storeName);
        if (model) {
          const { hasChange } = this._mixinModel(model, partials[0]);
          this._singleStores.set(storeName, model);
          hasChange && this._notifyIdSubscribers(storeName, model.id);
        }
      }
    }

    this._notifySubscribers(storeName);
    const currentIds = this.getIds(storeName);
    !isEqual(currentIds, prevIds) && this._notifyIdListSubscribers(storeName);
  }

  emitDelete<T extends STORE_NAME>(
    storeName: T,
    ids?: T extends keyof C
      ? C[T]['type'] extends HANDLER_TYPE.MULTIPLE
        ? string[]
        : never
      : never,
  ): void {
    const { model: ModelConstructor, type } = this._config[storeName] ?? {};
    if (!ModelConstructor) {
      throw new Error(`[emitDelete]ModelConstructor for ${storeName} not found`);
    }

    if (type === HANDLER_TYPE.MULTIPLE) {
      if (!ids || ids.length === 0) {
        return;
      }

      const store = this._multiStores.get(storeName);
      if (!store) {
        throw new Error(`[emitDelete]Store for ${storeName} not found`);
      }

      ids.forEach(id => {
        store.delete(id);
      });
    } else if (type === HANDLER_TYPE.SINGLE) {
      this._singleStores.delete(storeName);
    } else {
      throw new Error(`[emitDelete]Unknown type for ${storeName}`);
    }
    this._notifySubscribers(storeName);
    this._notifyIdListSubscribers(storeName);
  }
}

const storeManager = new StoreManager({
  [STORE_NAME.TOY]: {
    type: HANDLER_TYPE.MULTIPLE,
    model: ToyModel,
    sortValue: (a: ToyModel, b: ToyModel) => b.createTime - a.createTime,
  },
  [STORE_NAME.USER]: {
    type: HANDLER_TYPE.SINGLE,
    model: UserModel,
    sortValue: (a: UserModel, b: UserModel) => 1,
  },
});

// const toyStore = storeManager.get(STORE_NAME.TOY);
// const userStore = storeManager.get(STORE_NAME.USER);
// const toyIds = storeManager.getIds(STORE_NAME.TOY);
// const userIds = storeManager.getIds(STORE_NAME.USER);
// storeManager.refresh(STORE_NAME.USER, { id: '', name: '' });
// storeManager.refresh(STORE_NAME.TOY, [{ id: '', name: '', desc: '' }]);
// storeManager.emitUpdate(STORE_NAME.TOY, {
//   entities: [{ id: '1', name: '', desc: '' }],
//   partials: [{ id: '2', name: 'k' }],
// });
// storeManager.emitDelete(STORE_NAME.USER);
// storeManager.emitDelete(STORE_NAME.TOY, ['1']);
// const t = storeManager.getById(STORE_NAME.TOY, '1');
// const u = storeManager.getById(STORE_NAME.USER, '1');

export { storeManager };
