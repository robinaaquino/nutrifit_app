import admin from "firebase-admin";
import config from "../service_account.json";

try {
  admin.initializeApp({
    credential: admin.credential.cert(config),
  });
} catch (error) {
  if (!/already exists/u.test(error.message)) {
    console.error("Firebase admin initialization error", error.stack);
  }
}

export default admin;
