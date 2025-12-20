import admin from "firebase-admin";

admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))})

const db = admin.firestore();

async function run() {
  const gameID = 79546208627805
  const universeRes = await fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`);
  const universeData = await universeRes.json();
  const universeId = universeData.universeId;
  
  const gameRes = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`);
  const gameData = await gameRes.json();
  

  const gameId = gameData.data && gameData.data[0] ? gameData.data[0].id : 0;
  const players = gameData.data && gameData.data[0] ? gameData.data[0].playing : 0;

  const dateStr = new Date().toISOString().split("T")[0];

  const historyRef = db.collection("games").doc(gameId).collection("history").doc(dateStr); 
    await historyRef.set({
    players: players,
  });

  console.log(`Created collection '${collectionName}' with a document.`);
}

run().catch(console.error);
