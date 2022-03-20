export const getBaseUrl = (url: string) => {
    const BASE_URL = 'http://127.0.0.1:7001';
    // process.env.NODE_ENV === 'development'
    return BASE_URL + url;
};
