import { initializeApp, getApps } from "firebase-admin/app";

export const app = getApps().length > 0
  ? getApps()[0]
  : initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || "cortexai-609a4"
    });