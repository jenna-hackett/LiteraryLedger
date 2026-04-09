import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../utils/firebase";

export const searchUsers = async (searchText) => {
  if (!searchText) return [];
  
  try {
    const usersRef = collection(db, "users");
    // This finds users whose email or name exactly matches or starts with the text
    const q = query(
      usersRef, 
      where("email", ">=", searchText),
      where("email", "<=", searchText + "\uf8ff"),
      limit(10)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error finding readers:", error);
    return [];
  }
};