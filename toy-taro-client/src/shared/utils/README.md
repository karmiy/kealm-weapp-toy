## MakeObserver

```ts
class Example {
  @observable
  a: number = 11;

  @observable
  b: number = 11;

  constructor() {
    makeObserver(this);
  }

  @computed
  get sum() {
    Logger.getLogger('[test]').info('get sum');
    return this.a + this.b;
  }

  @computed
  get del() {
    Logger.getLogger('[test]').info('get del');
    return this.a - this.b;
  }
}

const example = new Example();
Logger.getLogger('[test]').info('sum', example.sum);
Logger.getLogger('[test]').info('del', example.del);
Logger.getLogger('[test]').info('del', example.del);
Logger.getLogger('[test]').info('sum', example.sum);
Logger.getLogger('[test]').info('-----------------------------------------');
example.a = 22;
Logger.getLogger('[test]').info('sum', example.sum);
Logger.getLogger('[test]').info('del', example.del);
Logger.getLogger('[test]').info('-----------------------------------------');
example.b = 33;
Logger.getLogger('[test]').info('sum', example.sum);
Logger.getLogger('[test]').info('del', example.del);
Logger.getLogger('[test]').info('sum', example.sum);
Logger.getLogger('[test]').info('del', example.del);
Logger.getLogger('[test]').info('example', example);
```