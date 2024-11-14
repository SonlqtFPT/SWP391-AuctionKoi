importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyAGrmgZPIZeO4yD1ng6RSyRu0GgapNB-YE",
    authDomain: "swptest-7f1bb.firebaseapp.com",
    projectId: "swptest-7f1bb",
    storageBucket: "swptest-7f1bb.appspot.com",
    messagingSenderId: "312264882389",
    appId: "1:312264882389:web:cff6e4f72e3eb201518a5c",
    measurementId: "G-5DFMCPBY4W"
});

const messaging = firebase.messaging();

self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
});

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload.notification.title);
    
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/path/to/your/icon.png',
        data: payload.data,
        requireInteraction: true  // Thêm thuộc tính này để thông báo ở lại cho đến khi user tắt
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});