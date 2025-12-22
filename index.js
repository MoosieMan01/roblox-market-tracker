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

  const topGames = (json.collection?.items || json.games || []).map(g => ({
    placeId: g.rootPlaceId,
    playing: g.playerCount
  }));

  const dateStr = new Date().toISOString().split("T")[0];
  console.log(topGames);
  for (const game of topGames) {

    const universeRes = await fetch(
      `https://apis.roblox.com/universes/v1/places/${game.placeId}/universe`
    );
    const universeData = await universeRes.json();

    if (!universeData.universeId) continue;
    const universeId = universeData.universeId;


    const gameRes = await fetch(
      `https://games.roblox.com/v1/games?universeIds=${universeId}`
    );
    const gameData = await gameRes.json();

    if (!gameData.data || !gameData.data[0]) continue;

    const gameId = gameData.data[0].id;
    const players = gameData.data[0].playing;

    await db
      .collection("games")
      .doc(gameId.toString())
      .collection("history")
      .doc(dateStr)
      .set({
        players
      });

  }
}

run().catch(console.error);
