import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function createGreeting(greetingData: any, userId: string) {
  // Generate slug dynamically
  const slug = `${greetingData.senderName}-wishes-${greetingData.receiverName}-${greetingData.eventName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // Use slug as custom ID
  const greetingRef = doc(collection(db, "greetings"), slug);

  const payload = {
    id: greetingRef.id,
    userId,
    title: greetingData.title || "My Greeting",
    slug,
    eventType: greetingData.eventType,
    eventName: greetingData.eventName,
    eventEmoji: greetingData.eventEmoji,
    senderName: greetingData.senderName,
    receiverName: greetingData.receiverName,
    theme: greetingData.theme || "colorful",
    layout: greetingData.layout || "grid",
    frameStyle: greetingData.frameStyle || "classic",
    animationStyle: greetingData.animationStyle || "fade",

    texts: greetingData.texts || [],
    media: greetingData.media || [],
    emojis: greetingData.emojis || [],
    backgroundSettings: greetingData.backgroundSettings || {},
    borderSettings: greetingData.borderSettings || {},

    isPublic: true,
    viewCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(greetingRef, payload);
  return greetingRef.id;
}
