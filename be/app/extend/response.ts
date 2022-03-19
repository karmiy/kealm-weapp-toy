import { Response } from 'egg';

export default {
    setToken(this: Response, token: string) {
        return this.set({
            token,
        });
    },
};
