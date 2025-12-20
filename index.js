const admin = require("firestore_admin");
admin.InitializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))})
