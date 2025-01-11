import { Dispatch, useMemo, useRef, useState } from 'react';
import { HookState, InitialHookState, resolveHookState } from '@/utils/resolveHookState';
import { useForceUpdate } from './useForceUpdate';

function useGetSet<S = undefined>(): [() => S | undefined, Dispatch<HookState<S | undefined>>];
function useGetSet<S>(initialState: InitialHookState<S>): [() => S, Dispatch<HookState<S>>];
function useGetSet<S>(initialState?: InitialHookState<S>) {
  const [initState] = useState(() => resolveHookState(initialState));
  const state = useRef(initState);
  const update = useForceUpdate();

  return useMemo(
    () => [
      // get
      () => state.current as S,
      // set
      (newState: HookState<S>) => {
        state.current = resolveHookState(newState, state.current);
        update();
      },
    ],
    [update],
  );
}

export { useGetSet };
