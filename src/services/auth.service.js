import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

export const Login_auth = async (email, password) => {
  // 1️⃣ Login من Firebase Auth
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const userId = userCredential.user.uid;

  // 2️⃣ نجيب بياناته من Firestore
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User data not found");
  }

  return {
    uid: userId,
    ...userSnap.data(),
  };
};
