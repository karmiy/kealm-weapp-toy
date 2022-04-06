const ID_SERIAL = [
    'w',
    'x',
    'c',
    '4',
    'e',
    'b',
    'b',
    'd',
    'e',
    'b',
    'c',
    'f',
    '4',
    '5',
    'c',
    '1',
    '0',
    '8',
];
const SECRET_SERIAL = [
    '8',
    '1',
    'b',
    '6',
    '1',
    '7',
    'b',
    '5',
    'f',
    '5',
    'd',
    '6',
    'a',
    'd',
    '9',
    '5',
    '8',
    '2',
    '9',
    'd',
    '9',
    '5',
    '1',
    'f',
    '3',
    '2',
    '0',
    'd',
    '2',
    '7',
    'e',
    '3',
];

export default {
    getCurrentTime() {
        return new Date().toLocaleString();
    },
    get currentTime() {
        return this.getCurrentTime();
    },
    /* 小程序 */
    get AppID() {
        return ID_SERIAL.join('');
    },
    get AppSecret() {
        return SECRET_SERIAL.join('');
    },
};
