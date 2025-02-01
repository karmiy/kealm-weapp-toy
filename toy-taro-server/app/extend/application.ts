const ID_SERIAL = [
  "w",
  "x",
  "c",
  "4",
  "e",
  "b",
  "b",
  "d",
  "e",
  "b",
  "c",
  "f",
  "4",
  "5",
  "c",
  "1",
  "0",
  "8",
];
const SECRET_SERIAL = [
  "c",
  "3",
  "f",
  "5",
  "8",
  "d",
  "2",
  "c",
  "4",
  "4",
  "f",
  "0",
  "f",
  "0",
  "8",
  "2",
  "e",
  "5",
  "e",
  "0",
  "d",
  "f",
  "f",
  "9",
  "b",
  "7",
  "d",
  "0",
  "4",
  "5",
  "9",
  "8",
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
    return ID_SERIAL.join("");
  },
  get AppSecret() {
    return SECRET_SERIAL.join("");
  },
};
