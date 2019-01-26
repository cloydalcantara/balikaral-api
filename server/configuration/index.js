if (process.env.NODE_ENV === 'test') {
  module.exports = {
    JWT_SECRET: 'balikaralauthentication',
    oauth: {
      google: {
        clientID: 'number',
        clientSecret: 'string',
      },
      facebook: {
        clientID: 'number',
        clientSecret: 'string',
      },
    },
  };
} else {
  module.exports = {
    JWT_SECRET: 'balikaralauthentication',
    oauth: {
      google: {
        clientID: '1',
        clientSecret: '1',
      },
      facebook: {
        clientID: '1',
        clientSecret: '1',
      },
    },
  };
}
