var username = process.env.USER || process.env.USERNAME || process.env.LOGNAME;

module.exports = {
  env: 'development',

  connections: {
    redis: {
      partition: 'cliostats-' + username
    }
  },

  mongo: {
    uri: 'mongodb://localhost/cliostats',
    options: {
      debug: true
    }
  }
};
