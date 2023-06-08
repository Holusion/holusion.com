const {onRequest} = require('firebase-functions/v2/https');
const admin = require("firebase-admin");


const app = admin.initializeApp();
app.firestore().settings({timestampsInSnapshots: true});

const handlers = require("./handlers");

// https functions must use us-central-1 region
exports.http_calls = onRequest({
  maxInstances: 1,
  cpu: 1,
}, handlers);