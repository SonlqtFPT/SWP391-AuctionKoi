/* eslint-disable react/no-unescaped-entities */
import { FaInfoCircle, FaPhone, FaFileContract } from "react-icons/fa";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app, VAPID_KEY } from "../config/firebase";
import { sendTokenToServer } from "../services/notificationService";
// import NotificationButton from "./NotificationButton";
// import { app } from "../config/firebase";
import { FaHeart } from "react-icons/fa";
import { Button } from "antd";
import api from "../config/axios";
import axios from "axios";
import { toast } from "react-toastify";

const Follow = ({ lotId, followed }) => {
  const messaging = getMessaging(app);

  const [notificationPermission, setNotificationPermission] = useState(
    Notification.permission
  );
  const [currentToken, setCurrentToken] = useState(null);
  const [error, setError] = useState(null);
  const [FCM, setFCM] = useState();

  const post_FCM_api = "notification/subscribe";

  const handleSendFCM = async () => {
    try {
      console.log("lotId neeeee: ", lotId);
      console.log("da follow chua neeeee: ", followed);
      const token = localStorage.getItem("accessToken");
      const response = await api.post(
        post_FCM_api,
        {
          lotId: lotId, // ID của lô
          token: FCM,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Added to favorites"); // Hiển thị thông báo thành công
      }
    } catch (error) {
      console.error("Error handleSendFCM at Follow.jsx:", error);
    }
  };

  const getTokenAndSend = async () => {
    try {
      const currentRegistration =
        await navigator.serviceWorker.getRegistration();

      if (!currentRegistration) {
        throw new Error("Service Worker registration not found");
      }

      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: currentRegistration,
      });

      setFCM(token);

      if (token) {
        console.log("FCM Token:", token); // Log token to console
        setCurrentToken(token);
        localStorage.setItem("fcmToken", token);
        await sendTokenToServer(token);
      } else {
        throw new Error("No registration token available");
      }
    } catch (error) {
      console.error("Error getting token:", error);
      setError("Error getting notification token: " + error.message);
    }
  };

  const initializeFirebaseMessaging = async () => {
    try {
      if (!("serviceWorker" in navigator)) {
        throw new Error("Service Worker is not supported");
      }

      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        {
          scope: "/",
        }
      );

      await navigator.serviceWorker.ready;

      const storedToken = localStorage.getItem("fcmToken");

      if (Notification.permission === "granted") {
        await getTokenAndSend();
      } else if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);

        if (permission === "granted") {
          await getTokenAndSend();
        }
      }
    } catch (error) {
      console.error("Failed to initialize Firebase Messaging:", error);
      setError("Failed to initialize notifications: " + error.message);
    }
  };

  useEffect(() => {
    const currentURL = window.location.href;
    if (currentURL === "http://localhost:5173/") {
      console.log("hi");
    }

    const handleVisibilityChange = async () => {
      if (
        document.visibilityState === "visible" &&
        Notification.permission === "granted"
      ) {
        const newToken = await getTokenAndSend();
        if (newToken) {
          setCurrentToken(newToken);
          localStorage.setItem("fcmToken", newToken);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Set up foreground message handler
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Received foreground message:", payload);
      const { title, body } = payload.notification;

      if (Notification.permission === "granted") {
        new Notification(title, {
          body,
          icon: "/path/to/your/icon.png",
        });
      }
    });

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      unsubscribe();
    };
  }, []);

  return (
    <Button
      onClick={() => {
        initializeFirebaseMessaging();
        handleSendFCM();
      }}
      variant="primary"
      disabled={notificationPermission === "denied"}
    >
      {followed ? (
        <FaHeart className="text-red-500" /> // Nếu followed là true
      ) : (
        <FaHeart /> // Nếu followed là false
      )}
    </Button>
  );
};

export default Follow;
