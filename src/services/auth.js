import { auth } from '../config/firebase';

// Register a new user with email and password
export const registerUser = async (email, password) => {
  try {
    await auth.createUserWithEmailAndPassword(email, password);
    console.log('User registered successfully');
  } catch (error) {
    console.error('Error registering user:', error);
  }
};

// Login a user with email and password
export const loginUser = async (email, password) => {
  try {
    await auth.signInWithEmailAndPassword(email, password);
    console.log('User logged in successfully');
  } catch (error) {
    console.error('Error logging in user:', error);
  }
};

// Logout the current user
export const logoutUser = async () => {
  try {
    await auth.signOut();
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error logging out user:', error);
  }
};
