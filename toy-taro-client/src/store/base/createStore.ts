import { useLayoutEffect, useMemo } from 'react';
import { useGetSet } from '@/hooks';
import { EventEmitter } from '@/utils/event';
import { ResolvableHookState, resolveHookState, InitialHookState } from '@/utils//resolveHookState';

const eventEmitter = new EventEmitter();

type ResolvableState<S> = ResolvableHookState<S>;
// interface RawDispatch {
//     (actionName: string, ...params: any[]): any;
// }
interface ActionContext<S> {
    state: S;
    commit: (nextState: ResolvableState<S>) => void;
    // dispatch: RawDispatch;
}

interface RawAction<S, P> {
    (context: ActionContext<S>, payload: P): any;
}

type RawActions<S, P = any> = Record<string, RawAction<S, P>>;

// type PayloadFormatter<T> = T extends (...payload: any[]) => void ? () => ReturnType<T> : T;

type Actions<S, RAS> = {
    [actionName in keyof RAS]: 
        RAS[actionName] extends (context: ActionContext<S>, ...payload: infer P) => void
            ? (...payload: P) => ReturnType<RAS[actionName]>
            : never
};

type PickPayload<S, A> = A extends (context: ActionContext<S>, payload: infer P) => void
    ? P
    : never;

export const createStore = <S, RAS extends RawActions<S>>(
    moduleName: string,
    baseState: InitialHookState<S>,
    rawActions: RAS,
) => {
    const useStore = (initialState?: InitialHookState<S>) => {
        const [get, set] = useGetSet<S>(initialState ?? baseState);
        const state = get();

        const actions = useMemo(() => {
            return Object.keys(rawActions).reduce((bus, actionName) => {
                const key = actionName as keyof RAS;
                const action = rawActions[key];
                bus[key] = ((payload: PickPayload<S, typeof action>) => {
                    return action(
                        {
                            commit: nextState =>
                                eventEmitter.emit(
                                    moduleName,
                                    resolveHookState(nextState, get()),
                                ),
                            state: get(),
                        },
                        payload,
                    );
                }) as Actions<S, RAS>[keyof RAS];
                return bus;
            }, {} as Actions<S, RAS>);
        }, []);

        useLayoutEffect(() => {
            eventEmitter.on(moduleName, set);

            return () => eventEmitter.off(moduleName, set);
        }, [set]);

        return { state, actions };
    };

    return [
        useStore,
    ] as const;
};