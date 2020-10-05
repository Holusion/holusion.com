const functions = require('firebase-functions');
const admin = require("firebase-admin");


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const app = admin.initializeApp();
app.firestore().settings({timestampsInSnapshots: true});

const handlers = require("./handlers");

exports.api_calls = functions.https.onRequest(handlers);