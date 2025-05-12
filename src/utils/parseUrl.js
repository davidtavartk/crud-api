import url from 'node:url';

export const parseUrl = (req) => {
  return url.parse(req.url, true);
};
