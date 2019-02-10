if (process.env.NODE_ENV === 'test') {
  module.exports = {
    JWT_SECRET: 'balikaralauthentication',
    oauth: {
      google: {
        clientID: '197880274985-qae1s30vumso0tbr25iaf9lrk89e3tp7.apps.googleusercontent.com',
        clientSecret: '_HgQ8_DZkD-HQlfU9TFVGPEX'
      },
      facebook: {
        clientID: '521442691675915',
        clientSecret: 'c89012f33d778db73da4f7d9c9d6e793',
      },
    },
  };
} else {
  module.exports = {
    JWT_SECRET: 'balikaralauthentication',
    oauth: {
      google: {
        clientID: '197880274985-qae1s30vumso0tbr25iaf9lrk89e3tp7.apps.googleusercontent.com',
        clientSecret: '_HgQ8_DZkD-HQlfU9TFVGPEX'
      },
      facebook: {
        clientID: '521442691675915',
        clientSecret: 'c89012f33d778db73da4f7d9c9d6e793'
      },
    },
  };
}
