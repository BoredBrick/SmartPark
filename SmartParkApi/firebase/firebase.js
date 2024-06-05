const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./smartpark-d9f63-firebase-adminsdk-dfry4-b0d840fd81.json");

initializeApp({
  credential: cert(serviceAccount),
});

const firestore = getFirestore();

module.exports = { firestore };
