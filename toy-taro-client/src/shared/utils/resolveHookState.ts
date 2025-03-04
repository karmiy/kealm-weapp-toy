import isFunction from 'lodash/isFunction';

export type StateSetter<S> = (prevState: S) => S;
export type InitialStateSetter<S> = () => S;

export type InitialHookState<S> = S | InitialStateSetter<S>;
export type HookState<S> = S | StateSetter<S>;
export type ResolvableHookState<S> = S | StateSetter<S> | InitialStateSetter<S>;

export function resolveHookState<S>(newState: InitialStateSetter<S>): S;
export function resolveHookState<S, C extends S>(newState: StateSetter<S>, currentState: C): S;
export function resolveHookState<S, C extends S>(
  newState: ResolvableHookState<S>,
  currentState?: C,
): S;
export function resolveHookState<S, C extends S>(
  newState: ResolvableHookState<S>,
  currentState?: C,
): S {
  if (isFunction(newState)) {
    return newState(currentState as S);
  }

  return newState;
}
