export const getBaseUrl = (url: string) => {
  const BASE_URL =
    process.env.NODE_ENV === 'development'
      ? 'http://192.168.2.243:7001'
      : 'https://karmiy.cn/toy-server';
  // : 'https://81.69.219.242';
  // : 'http://1.13.252.193:7001';
  // process.env.NODE_ENV === 'development'
  return BASE_URL + url;
};
