module.exports = {
  env: 'ci',

  connections: {
    redis: {
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
