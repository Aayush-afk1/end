// File: /api/verify-token.js

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, remove } from 'firebase/database';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDKwORtOFhbwcBOYhNdcC3hdtqBj1Vk_I",
  authDomain: "ayush-4d7e2.firebaseapp.com",
  databaseURL: "https://ayush-4d7e2-default-rtdb.firebaseio.com",
  projectId: "ayush-4d7e2",
  storageBucket: "ayush-4d7e2.firebasestorage.app",
  messagingSenderId: "704386566850",
  appId: "1:704386566850:web:e683c41184769e2913095b",
  measurementId: "G-SEJTV16J8S"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Missing token");
  }

  try {
    const tokenRef = ref(db, `tokens/${token}`);
    const snapshot = await get(tokenRef);

    if (!snapshot.exists()) {
      return res.status(403).send("❌ Invalid or expired link");
    }

    // Delete the token so it can't be used again
    await remove(tokenRef);

    // Return the one-time content
    return res.status(200).send(`
      <html>
        <head><title>Secret Page</title></head>
        <body style="text-align: center; font-family: sans-serif; margin-top: 100px;">
          <h1>🎉 Secret Page</h1>
          <p>This link was used successfully and will not work again.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(500).send("Server error");
  }
}
