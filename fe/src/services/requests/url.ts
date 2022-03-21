export const getBaseUrl = (url: string) => {
    const BASE_URL = 'http://192.168.2.243:7001';
    // process.env.NODE_ENV === 'development'
    return BASE_URL + url;
};
