import { collection, query, where, getDocs, limit, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../utils/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

export const updateBookStatus = async (userId, bookData, status) => {
  try {
    const userRef = doc(db, "users", userId);
    
    await updateDoc(userRef, {
      [`library.${bookData.id}`]: {
        id: bookData.id,
        title: bookData.volumeInfo.title,
        authors: bookData.volumeInfo.authors || ["Unknown Author"],
        thumbnail: bookData.volumeInfo.imageLinks?.thumbnail || "",
        status: status, // 'reading', 'read', or 'want-to-read'
        updatedAt: new Date().toISOString()
      }
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error updating book status:", error);
    return { success: false, error: error.message };
  }
};

export const uploadProfilePicture = async (userId, file) => {
  try {
    // Create a path in the storage vault
    const storageRef = ref(storage, `profile_pictures/${userId}`);
    
    // Upload the raw bytes of the image
    await uploadBytes(storageRef, file);
    
    // Get the permanent URL so we can save it to the user's profile
    const downloadURL = await getDownloadURL(storageRef);
    
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error("Upload failed:", error);
    return { success: false, error: error.message };
  }
};

export const searchUsers = async (searchText) => {
  if (!searchText) return [];
  
  try {
    const usersRef = collection(db, "users");
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

export const updateUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      bio: profileData.bio,
      photoURL: profileData.photoURL,
      displayName: `${profileData.firstName} ${profileData.lastName}`
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};