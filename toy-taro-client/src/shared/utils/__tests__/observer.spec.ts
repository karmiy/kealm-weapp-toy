import { computed, makeObserver, observable, reaction } from '../observer';

class Example {
  @observable
  a = 20;

  @observable
  b = 10;

  constructor() {
    makeObserver(this);
  }

  @computed
  get sum() {
    return this.a + this.b;
  }

  @computed
  get subtract() {
    return this.a - this.b;
  }

  @computed
  get totalScore() {
    return this.sum * 2;
  }

  @computed
  get currentScore() {
    return this.sum + 20;
  }
}

class ReactionExample {
  private _disposers: (() => void)[] = [];

  constructor(private _example: Example) {}

  a: {
    cur: number;
    prev: number | undefined;
  } = {
    cur: -1,
    prev: -1,
  };

  totalScore: {
    cur: number;
    prev: number | undefined;
  } = {
    cur: -1,
    prev: -1,
  };

  init(options?: { fireImmediately?: boolean }) {
    this._disposers.push(
      reaction(
        () => this._example.a,
        (cur, prev) => {
          this.a.cur = cur;
          this.a.prev = prev;
        },
        options as any,
      ),
    );

    this._disposers.push(
      reaction(
        () => this._example.totalScore,
        (cur, prev) => {
          this.totalScore.cur = cur;
          this.totalScore.prev = prev;
        },
        options as any,
      ),
    );
  }

  dispose() {
    this._disposers.forEach(disposer => disposer());
  }
}

const setup = () => {
  const example = new Example();
  const reactionExample = new ReactionExample(example);
  return { example, reactionExample };
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('observable', () => {
  it('should return correct value', () => {
    const { example } = setup();
    expect(example.a).toBe(20);
    expect(example.b).toBe(10);

    example.a = 22;
    expect(example.a).toBe(22);
    expect(example.b).toBe(10);

    example.b = 11;
    expect(example.a).toBe(22);
    expect(example.b).toBe(11);
  });
});

describe('computed', () => {
  it('should return correct value', () => {
    const { example } = setup();
    expect(example.sum).toBe(30);
    expect(example.subtract).toBe(10);
    expect(example.totalScore).toBe(60);
    expect(example.currentScore).toBe(50);

    example.a = 20;
    expect(example.sum).toBe(30);
    expect(example.subtract).toBe(10);
    expect(example.totalScore).toBe(60);
    expect(example.currentScore).toBe(50);

    example.a = 22;
    expect(example.sum).toBe(32);
    expect(example.subtract).toBe(12);
    expect(example.totalScore).toBe(64);
    expect(example.currentScore).toBe(52);

    example.b = 11;
    expect(example.sum).toBe(33);
    expect(example.subtract).toBe(11);
    expect(example.totalScore).toBe(66);
    expect(example.currentScore).toBe(53);
  });
});

describe('reaction', () => {
  it('should correctly observe with fireImmediately', () => {
    const { reactionExample, example } = setup();

    const reactionExample2 = new ReactionExample(example);

    reactionExample.init({ fireImmediately: true });
    reactionExample2.init({ fireImmediately: true });
    expect(reactionExample.a).toEqual({
      cur: 20,
      prev: undefined,
    });
    expect(reactionExample.totalScore).toEqual({
      cur: 60,
      prev: undefined,
    });
    expect(reactionExample2.a).toEqual({
      cur: 20,
      prev: undefined,
    });
    expect(reactionExample2.totalScore).toEqual({
      cur: 60,
      prev: undefined,
    });

    example.b = 11;
    expect(reactionExample.a).toEqual({
      cur: 20,
      prev: undefined,
    });
    expect(reactionExample.totalScore).toEqual({
      cur: 62,
      prev: 60,
    });
    expect(reactionExample2.a).toEqual({
      cur: 20,
      prev: undefined,
    });
    expect(reactionExample2.totalScore).toEqual({
      cur: 62,
      prev: 60,
    });

    example.a = 21;
    expect(reactionExample.a).toEqual({
      cur: 21,
      prev: 20,
    });
    expect(reactionExample.totalScore).toEqual({
      cur: 64,
      prev: 62,
    });
    expect(reactionExample2.a).toEqual({
      cur: 21,
      prev: 20,
    });
    expect(reactionExample2.totalScore).toEqual({
      cur: 64,
      prev: 62,
    });

    reactionExample.dispose();
    example.a = 23;
    expect(reactionExample.a).toEqual({
      cur: 21,
      prev: 20,
    });
    expect(reactionExample.totalScore).toEqual({
      cur: 64,
      prev: 62,
    });
    expect(reactionExample2.a).toEqual({
      cur: 23,
      prev: 21,
    });
    expect(reactionExample2.totalScore).toEqual({
      cur: 68,
      prev: 64,
    });

    reactionExample2.dispose();
    example.a = 24;
    expect(reactionExample.a).toEqual({
      cur: 21,
      prev: 20,
    });
    expect(reactionExample.totalScore).toEqual({
      cur: 64,
      prev: 62,
    });
    expect(reactionExample2.a).toEqual({
      cur: 23,
      prev: 21,
    });
    expect(reactionExample2.totalScore).toEqual({
      cur: 68,
      prev: 64,
    });
  });

  it('should correctly observe without fireImmediately', () => {
    const { reactionExample, example } = setup();

    const reactionExample2 = new ReactionExample(example);

    reactionExample.init({ fireImmediately: false });
    reactionExample2.init({ fireImmediately: false });
    expect(reactionExample.a).toEqual({
      cur: -1,
      prev: -1,
    });
    expect(reactionExample.totalScore).toEqual({
      cur: -1,
      prev: -1,
    });
    expect(reactionExample2.a).toEqual({
      cur: -1,
      prev: -1,
    });
    expect(reactionExample2.totalScore).toEqual({
      cur: -1,
      prev: -1,
    });

    example.b = 11;
    expect(reactionExample.a).toEqual({
      cur: -1,
      prev: -1,
    });
    expect(reactionExample.totalScore).toEqual({
      cur: 62,
      prev: 60,
    });
    expect(reactionExample2.a).toEqual({
      cur: -1,
      prev: -1,
    });
    expect(reactionExample2.totalScore).toEqual({
      cur: 62,
      prev: 60,
    });

    example.a = 21;
    expect(reactionExample.a).toEqual({
      cur: 21,
      prev: 20,
    });
    expect(reactionExample.totalScore).toEqual({
      cur: 64,
      prev: 62,
    });
    expect(reactionExample2.a).toEqual({
      cur: 21,
      prev: 20,
    });
    expect(reactionExample2.totalScore).toEqual({
      cur: 64,
      prev: 62,
    });

    reactionExample.dispose();
    example.a = 23;
    expect(reactionExample.a).toEqual({
      cur: 21,
      prev: 20,
    });
    expect(reactionExample.totalScore).toEqual({
      cur: 64,
      prev: 62,
    });
    expect(reactionExample2.a).toEqual({
      cur: 23,
      prev: 21,
    });
    expect(reactionExample2.totalScore).toEqual({
      cur: 68,
      prev: 64,
    });

    reactionExample2.dispose();
    example.a = 24;
    expect(reactionExample.a).toEqual({
      cur: 21,
      prev: 20,
    });
    expect(reactionExample.totalScore).toEqual({
      cur: 64,
      prev: 62,
    });
    expect(reactionExample2.a).toEqual({
      cur: 23,
      prev: 21,
    });
    expect(reactionExample2.totalScore).toEqual({
      cur: 68,
      prev: 64,
    });
  });

  it('should correctly observe on constructor and dispose correctly', () => {
    class ReactionExa {
      @observable
      id = 1;

      name = '';

      private _disposer: () => void;

      constructor() {
        makeObserver(this);

        this._disposer = reaction(
          () => this.id,
          cur => {
            this.name = `name_${cur}`;
          },
          {
            fireImmediately: true,
          },
        );
      }

      dispose() {
        this._disposer();
      }
    }
    const reactionExample = new ReactionExa();
    expect(reactionExample.name).toBe('name_1');
    reactionExample.id = 2;
    expect(reactionExample.name).toBe('name_2');
    reactionExample.dispose();
    reactionExample.id = 3;
    expect(reactionExample.name).toBe('name_2');
  });
});
