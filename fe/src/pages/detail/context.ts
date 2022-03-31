import { createContext } from 'react';

export const StatisticsContext = createContext<{
    statistics?: Record<
        string,
        {
            income: number;
            expenditure: number;
        }
    >;
}>({});
