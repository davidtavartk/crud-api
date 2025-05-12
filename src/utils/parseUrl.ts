import url from 'node:url';
import { IncomingMessage } from 'node:http';

export const parseUrl = (req: IncomingMessage): url.UrlWithParsedQuery => {
  return url.parse(req.url!, true);
};