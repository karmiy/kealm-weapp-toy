import { Undefinable } from '../types';
// function computed({ deps }: { deps: string[] }) {
//   return function (_target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     const originalMethod = descriptor.get!; // 获取 getter 方法
//     const cacheKey = `__computed_cache_${propertyKey}`; // 缓存结果的 key
//     const depsKey = `__computed_deps_${propertyKey}`; // 缓存依赖值的 key

//     descriptor.get = function () {
//       // 初始化缓存和依赖值存储
//       if (!this[cacheKey]) {
//         this[cacheKey] = undefined; // 初始缓存值
//       }
//       if (!this[depsKey]) {
//         this[depsKey] = {}; // 初始依赖值
//       }

//       // 检查依赖是否发生变化
//       const isDepsChanged = deps.some(dep => this[depsKey][dep] !== this[dep]);

//       if (isDepsChanged) {
//         // 更新依赖的值
//         deps.forEach(dep => {
//           this[depsKey][dep] = this[dep];
//         });

//         // 重新计算结果
//         this[cacheKey] = originalMethod.call(this);
//       }

//       return this[cacheKey];
//     };
//   };
// }

const PREFIX_OBSERVER = '__K_OBSERVER';
const getObservableKeys = () => `${PREFIX_OBSERVER}__KEYS`;
const getObservableProxyKey = (propertyKey: string) =>
  `${PREFIX_OBSERVER}__observable__${propertyKey}__proxy`;
const getObservableObserversKey = (propertyKey: string) =>
  `${PREFIX_OBSERVER}__observable__${propertyKey}__observers`;
const getComputedProxyKey = (propertyKey: string) =>
  `${PREFIX_OBSERVER}__computed__${propertyKey}__proxy`;
const getComputedDirtyStatusKey = (propertyKey: string) =>
  `${PREFIX_OBSERVER}__computed__${propertyKey}__dirty`;
const getComputedReadStatusKey = (propertyKey: string) =>
  `${PREFIX_OBSERVER}__computed__${propertyKey}__read`;
const getComputedDirtyActionKey = (propertyKey: string) =>
  `${PREFIX_OBSERVER}__computed__${propertyKey}__dirty_action`;
const getComputedObserversKey = (propertyKey: string) =>
  `${PREFIX_OBSERVER}__computed__${propertyKey}__observers`;

type ObserverType = 'reaction' | 'computed';
type Observer = (() => void) & { disposers?: Set<() => void> } & {
  _sortValue?: number;
  _sortType?: ObserverType;
};

// class DependencyTracker {
//   private static _sortValue = 0;
//   static stack: Observer[] = [];

//   static start(observer: Observer, type: ObserverType) {
//     observer._sortValue = this._sortValue++;
//     observer._sortType = type;
//     this.stack.push(observer);
//   }

//   static end() {
//     this.stack.pop();
//   }
// }

class DependencyTracker {
  static stack: Observer[] = [];

  static start(observer: Observer) {
    this.stack.push(observer);
  }

  static end() {
    this.stack.pop();
  }
}

function makeObserver(target: any) {
  const targetObservableKeys = target[getObservableKeys()];
  if (!targetObservableKeys) {
    return;
  }
  [...targetObservableKeys].forEach(propertyKey => {
    const observableProxyKey = getObservableProxyKey(propertyKey);
    const observableObserversKey = getObservableObserversKey(propertyKey);

    target[observableProxyKey] = target[propertyKey];
    Reflect.defineProperty(target, propertyKey, {
      get() {
        if (!this[observableObserversKey]) {
          this[observableObserversKey] = new Set<Observer>();
        }

        const observer = [...DependencyTracker.stack].pop();
        if (observer) {
          const disposers = observer.disposers ?? new Set();
          disposers.add(() => this[observableObserversKey].delete(observer));
          observer.disposers = disposers;
          this[observableObserversKey].add(observer);
        }

        return this[observableProxyKey];
      },
      set(value) {
        const oldValue = this[observableProxyKey];
        if (oldValue !== value) {
          this[observableProxyKey] = value;
          if (this[observableObserversKey]) {
            const observers: Array<Observer> = [...this[observableObserversKey]];
            observers.forEach(observer => observer());
          }
        }
      },
    });
  });
}

function observable(target: any, propertyKey: string) {
  const observableObserversKey = getObservableKeys();
  if (!target[observableObserversKey]) {
    target[observableObserversKey] = new Set<string>();
  }
  target[observableObserversKey].add(propertyKey);
}

function computed(_target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalGetter = descriptor.get!;

  descriptor.get = function () {
    const computedReadStatusKey = getComputedReadStatusKey(propertyKey);
    const computedProxyKey = getComputedProxyKey(propertyKey);
    const computedDirtyStatusKey = getComputedDirtyStatusKey(propertyKey);
    const computedDirtyActionKey = getComputedDirtyActionKey(propertyKey);
    const computedObserversKey = getComputedObserversKey(propertyKey);

    if (!this[computedReadStatusKey]) {
      this[computedDirtyStatusKey] = true;
      this[computedDirtyActionKey] = () => {
        this[computedDirtyStatusKey] = true;
        const observers = [...this[computedObserversKey]];
        observers.forEach(observer => observer());
      };
      this[computedProxyKey] = undefined;
      this[computedReadStatusKey] = true;
      this[computedObserversKey] = new Set<Observer>();
    }

    const observer = [...DependencyTracker.stack].pop();
    if (observer) {
      const disposers = observer.disposers ?? new Set();
      disposers.add(() => this[computedObserversKey].delete(observer));
      observer.disposers = disposers;
      this[computedObserversKey].add(observer);
    }
    if (this[computedDirtyStatusKey]) {
      DependencyTracker.start(this[computedDirtyActionKey]);

      try {
        this[computedProxyKey] = originalGetter.call(this);
      } finally {
        DependencyTracker.end();
        this[computedDirtyStatusKey] = false;
      }
    }
    return this[computedProxyKey];
  };
}

function reaction<T>(
  getter: () => T,
  effect: (newValue: T, oldValue: T) => void,
  options?: { fireImmediately?: false },
): () => void;
function reaction<T>(
  getter: () => T,
  effect: (newValue: T, oldValue: Undefinable<T>) => void,
  options: { fireImmediately: true },
): () => void;
function reaction<T>(
  getter: () => T,
  effect: (newValue: T, oldValue: Undefinable<T>) => void,
  options?: { fireImmediately?: boolean },
) {
  const { fireImmediately = false } = options ?? {};
  let currentValue: T | undefined; // 当前值

  const observer: Observer = () => {
    const newValue = getter();
    if (newValue !== currentValue) {
      effect(newValue, currentValue);
      currentValue = newValue;
    }
  };

  // 启动依赖追踪
  DependencyTracker.start(observer);
  try {
    currentValue = getter();
    fireImmediately && effect(currentValue, undefined);
  } finally {
    DependencyTracker.end();
  }

  // 返回取消观察的函数
  return () => observer.disposers?.forEach(disposer => disposer());
}

export { makeObserver, observable, computed, reaction };
