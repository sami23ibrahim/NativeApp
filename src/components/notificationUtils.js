// notificationUtils.js
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

const firestore = getFirestore();

export const addNotification = async (userId, notification) => {
  const userRef = doc(firestore, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const notifications = userDoc.data().notifications || [];
    
    // Add the new notification to the beginning
    const newNotifications = [{ ...notification, timestamp: new Date() }, ...notifications];
    
    // Keep only the latest 50 notifications
    if (newNotifications.length > 50) {
      newNotifications.length = 50;
    }

    await updateDoc(userRef, { notifications: newNotifications });
  }
};
