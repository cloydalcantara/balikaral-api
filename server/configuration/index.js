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
        clientID: '1111',
        clientSecret: '1111',
      },
      facebook: {
        clientID: '1111',
        clientSecret: '11111',
      },
    },
  };
}
//518018998676781 -
//9d45fb75acbaac0c58eedf692559ef66 - 
//
//344679316117018-dev
//101d522a604515ea7ff3eaa8110391a7-dev