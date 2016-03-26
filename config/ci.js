module.exports = {
  env: 'ci',

  connections: {
    api: {
      labels: ['api'],
      port: process.env.DOKKU_NGINX_PORT,
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
      partition: 'cliostats-ci'
    }
  },

  mongo: {
    uri: process.env.MONGO_URL,
    options: {
      debug: true
    }
  }
};
