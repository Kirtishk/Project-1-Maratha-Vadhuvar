import admin from "firebase-admin";
import fs from "fs";
import serviceAccount from "./service.json" with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function exportUsers() {
  const snapshot = await db.collection("users").get();

  const users = [];

  snapshot.forEach((doc) => {
    users.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

  console.log("Exported users.json");
}

exportUsers();
