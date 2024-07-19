// UserContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { FIREBASE_AUTH, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("User Data fetched in Context:", userData); // Debugging line
          setUser({ uid: currentUser.uid, displayName: userData.displayName, email: currentUser.email, ...userData });
        } else {
          console.log("User document does not exist"); // Debugging line
        }
      } else {
        console.log("No current user in Firebase Auth"); // Debugging line
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
