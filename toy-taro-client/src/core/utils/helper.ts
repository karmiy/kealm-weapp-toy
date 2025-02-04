import { getBaseUrl } from '../httpRequest';

export const getSourceUrl = (url: string) => {
  if (url.includes('http')) {
    return url;
  }
  return getBaseUrl(`/${url}`);
};
