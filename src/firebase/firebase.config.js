const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");

const serviceAccount = require("../../credentials/serviceAccount.json");

initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "proyectointegrador-533ba.firebasestorage.app"
});

const db = getFirestore();

const bucket = getStorage().bucket();

module.exports = {
    db,
    bucket
};