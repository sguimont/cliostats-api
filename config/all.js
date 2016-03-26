module.exports = {
  env: 'all',

  connections: {
    api: {
      labels: ['api'],
      port: process.env.DOKKU_NGINX_PORT || 9000,
      host: null,
      routes: {
        cors: {
          origin: ['*']
        }
      }
    },

    redis: {
      host: 'pub-redis-13256.us-east-1-3.4.ec2.garantiadata.com',
      port: 13256,
      partition: 'cliostats'
    }
  },

  security: {
    ttl: 24 * 60 * 60 * 1000, // 1 day
    key: 'C1s0y123wyTGz8k6M8l5QF2Cplm5Pouo',
    cookie: {
      name: 'session',
      options: {
        path: '/',
        isSecure: false,
        isHttpOnly: false,
        encoding: 'base64json',
        clearInvalid: false, // remove invalid cookies
        strictHeader: true // don't allow violations of RFC 6265
      }
    }
  },

  mongo: {
    uri: 'mongodb://localhost/cliostats',
    models: ROOT + '/models/**/*'
  },

  logging: {log: '*', response: '*'}
};
