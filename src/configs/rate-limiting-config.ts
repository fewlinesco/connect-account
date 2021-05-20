import memjs from "memjs";

const memcachedUrl = `${process.env.MEMCACHED_CLIENT_USERNAME}:${process.env.MEMCACHED_CLIENT_PASSWORD}@${process.env.MEMCACHED_CLIENT_SERVERS}`;
const memcachedClient = memjs.Client.create(memcachedUrl);

export default {
  windowMs: 300000,
  requestsUntilBlock: 200,
  memcachedClient,
};
