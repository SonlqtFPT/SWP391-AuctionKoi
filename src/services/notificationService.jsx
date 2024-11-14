import { getMessaging, getToken } from "firebase/messaging";
import { VAPID_KEY } from "../config/firebase";

export const getNotificationToken = async () => {
  try {
    const messaging = getMessaging();
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });

    if (token) {
      console.log("Your FCM Token:", token);
      console.log(
        "%c Copy this token for your backend!",
        "background: #222; color: #bada55; font-size: 16px;"
      );
      return token;
    } else {
      console.warn("No registration token available.");
      return null;
    }
  } catch (error) {
    console.error("Error getting token:", error);
    throw error;
  }
};

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getNotificationToken();
      return { permission, token };
    }
    return { permission, token: null };
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    throw error;
  }
};

export const sendTokenToServer = async (token) => {
  try {
    const response = await fetch(
      "http://localhost:8080/notification/subscribe",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtb25sYWkxQGdtYWlsLmNvbSIsImlhdCI6MTcyODYyMzc2MywiZXhwIjoxNzI4NzEwMTYzfQ.griX0ElUcTjvuhhi_EcHNclnnQdfWsf-exA7SIoECsOutLy4zHWfhv615n4YdBDbDrNXeM29kp_luWhyK7Pm1Q",
        },
        body: JSON.stringify({
          lotId: "1",
          token: token.toString(),
        }),
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error sending token to server:", error);
    throw error;
  }
};
