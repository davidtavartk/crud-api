import url from 'url';

export const parseUrl = (req) => {
  return url.parse(req.url, true);
};
