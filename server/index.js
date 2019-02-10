const app = require('./app');
const https = require('https');
const fs = require('fs');

const privateKey = fs.readFileSync('/etc/letsencrypt/live/balikaral.com-0001/fullchain.pem','utf8')
const certificate = fs.readFileSync('/etc/letsencrypt/live/balikaral.com-0001/privkey.pem','utf8')

// Start the server
const options = {
	key: certificate,
	cert: privateKey
}

https.createServer(options,app).listen(5000)

console.log('Server started');

// refactored code for easier test and feature scale
