export default {
    getCurrentTime() {
        return new Date().toLocaleString();
    },
    get currentTime() {
        return this.getCurrentTime();
    },
};
