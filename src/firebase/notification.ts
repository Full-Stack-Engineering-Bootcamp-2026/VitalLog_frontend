import { getToken } from "firebase/messaging"

import { messaging } from "./firebase"

export const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission()

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    })

    console.log("FCM TOKEN:", token)

    return token
  }

  console.log("Permission denied")
}
