
// // src/components/NotificationProvider.js
// import React, { createContext, useState, useEffect } from 'react';
// import { FIREBASE_AUTH } from '../config/firebase';
// import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
// import { onAuthStateChanged } from 'firebase/auth';

// export const NotificationContext = createContext();

// const firestore = getFirestore();

// export const NotificationProvider = ({ children }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadNotifications, setUnreadNotifications] = useState(false);
//   const [user, setUser] = useState(null);

//   const fetchNotifications = async (user) => {
//     if (user) {
//       const userRef = doc(firestore, 'users', user.uid);
//       const userDoc = await getDoc(userRef);

//       if (userDoc.exists()) {
//         const fetchedNotifications = userDoc.data().notifications || [];
//         setNotifications(fetchedNotifications);
//         const hasUnread = fetchedNotifications.some(notification => !notification.read);
//         setUnreadNotifications(hasUnread); // Set unread notifications state
//       } else {
//         console.log('User document does not exist');
//       }
//     } else {
//       console.log('No user is currently logged in');
//     }
//   };

//   const clearNotifications = async () => {
//     if (user) {
//       const userRef = doc(firestore, 'users', user.uid);
//       const updatedNotifications = notifications.map(notification => ({
//         ...notification,
//         read: true, // Mark all notifications as read
//       }));
//       await updateDoc(userRef, { notifications: updatedNotifications });
//       setNotifications(updatedNotifications);
//       setUnreadNotifications(false); // Reset unread notifications state
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (authUser) => {
//       if (authUser) {
//         setUser(authUser);
//         fetchNotifications(authUser);
//       } else {
//         setUser(null);
//         setNotifications([]);
//         setUnreadNotifications(false); // Reset unread notifications state
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <NotificationContext.Provider value={{ notifications, clearNotifications, unreadNotifications }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };

import React, { createContext, useState, useEffect } from 'react';
import { FIREBASE_AUTH } from '../config/firebase';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const NotificationContext = createContext();

const firestore = getFirestore();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(false);
  const [user, setUser] = useState(null);

  const fetchNotifications = async (user) => {
    if (user) {
      const userRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const fetchedNotifications = userDoc.data().notifications || [];
        setNotifications(fetchedNotifications);
        const hasUnread = fetchedNotifications.some(notification => !notification.read);
        setUnreadNotifications(hasUnread); // Set unread notifications state
       
      } else {
        console.log('User document does not exist');
      }
    } else {
      console.log('No user is currently logged in');
    }
  };

  const clearNotifications = async () => {
    if (user) {
      const userRef = doc(firestore, 'users', user.uid);
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true, // Mark all notifications as read
      }));
      await updateDoc(userRef, { notifications: updatedNotifications });
      setNotifications(updatedNotifications);
      setUnreadNotifications(false); // Reset unread notifications state
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchNotifications(authUser);
      } else {
        setUser(null);
        setNotifications([]);
        setUnreadNotifications(false); // Reset unread notifications state
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, clearNotifications, unreadNotifications, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
