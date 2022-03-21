export default {
    getCurrentTime() {
        return new Date().toLocaleString();
    },
    get currentTime() {
        return this.getCurrentTime();
    },
    /* 小程序 */
    get AppID() {
        return 'wxc4ebbdebcf45c108';
    },
    get AppSecret() {
        return '81b617b5f5d6ad95829d951f320d27e3';
    },
};
