import NodeCache from 'node-cache';

const CACHE_TTL = parseInt(process.env.CACHE_TTL || '21600', 10); // 6 hours in seconds

export const cache = new NodeCache({
  stdTTL: CACHE_TTL,
  checkperiod: 600, // Check for expired keys every 10 minutes
  useClones: false
});

export const getCacheKey = (prefix: string, id: string): string => {
  return `${prefix}:${id}`;
};
