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

type Observer = () => void;

class DependencyTracker {
  static current: Observer | null = null;

  static start(observer: Observer) {
    this.current = observer;
  }

  static end() {
    this.current = null;
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

        const currentObserver = DependencyTracker.current;
        if (currentObserver) {
          this[observableObserversKey].add(currentObserver);
        }

        return this[observableProxyKey];
      },
      set(value) {
        const oldValue = this[observableProxyKey];
        if (oldValue !== value) {
          this[observableProxyKey] = value;
          if (this[observableObserversKey]) {
            this[observableObserversKey].forEach(observer => observer());
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

    if (!this[computedReadStatusKey]) {
      this[computedDirtyStatusKey] = true;
      this[computedDirtyActionKey] = () => (this[computedDirtyStatusKey] = true);
      this[computedProxyKey] = undefined;
      this[computedReadStatusKey] = true;
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

export { makeObserver, observable, computed };
