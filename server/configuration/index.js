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
        clientID: '1234',
        clientSecret: '1234',
      },
      facebook: {
        clientID: '518018998676781',
        clientSecret: '9d45fb75acbaac0c58eedf692559ef66',
      },
    },
  };
}