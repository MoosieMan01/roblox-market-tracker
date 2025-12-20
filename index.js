const admin = require("firebase-admin");

admin.InitializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIRESTORE_JSON))})

const db = admin.firestore();

async function run() {
  const docRef = db.collection("game2").doc(); // auto-generated doc ID

  // Set the document data
  await docRef.set({
    timestamp: new Date()
  });

  console.log(`Created collection '${collectionName}' with a document.`);
}

run().catch(console.error);
