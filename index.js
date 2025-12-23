import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  )
});

const db = admin.firestore();

async function run() {
  const sessionId = crypto.randomUUID();
  const sortId = "top-playing-now";

  const res = await fetch(
    `https://apis.roblox.com/explore-api/v1/get-sort-content?sortId=${sortId}&limit=100&cursor=0&sessionId=${sessionId}`
  );
  const json = await res.json();

  const topPlaces = (json.collection?.items || json.games || []).map(g => ({
    placeId: g.rootPlaceId,
    playing: g.playerCount
  }));
  
  const batch = db.batch()

  console.log(topPlaces);
  const dateStr = new Date().toISOString().split("T")[0];
  for (const place of topPlaces) {
    const ref = db
      .collection("places")
      .doc(place.placeId.toString())
      .collection("history")
      .doc(dateStr);

    batch.set(ref, {players: place.players})
  }
  batch.commit()
}

run().catch(console.error);
