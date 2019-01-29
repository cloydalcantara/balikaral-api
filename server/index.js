const app = require('./app');
const https = require('https');
const fs = require('fs');
const http = require('http');
// Start the server

const privateKey = fs.readFileSync('/etc/letsencrypt/live/balikaralapi.eastus.cloudapp.azure.com-0001/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/balikaralapi.eastus.cloudapp.azure.com-0001/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/balikaralapi.eastus.cloudapp.azure.com-0001/chain.pem', 'utf8');

const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
};

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(5000, () => {
        console.log('HTTPS Server running on port 5000');
});

http.createServer(app).listen(6000);
