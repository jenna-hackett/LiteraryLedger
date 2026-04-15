import { collection, query, where, getDocs, limit, orderBy, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../utils/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

export const getCircleActivity = async (followingIds) => {
  if (!followingIds || followingIds.length === 0) return [];

  try {
    const usersRef = collection(db, "users");
    // Get the profiles of everyone user follows
    const q = query(usersRef, where("__name__", "in", followingIds));
    const querySnapshot = await getDocs(q);

    let activity = [];

    querySnapshot.docs.forEach(doc => {
      const userData = doc.data();
      if (userData.library) {
        // Turn object into a list of "events"
        Object.values(userData.library).forEach(book => {
          activity.push({
            scribeName: `${userData.firstName} ${userData.lastName}`,
            scribePhoto: userData.photoURL,
            ...book // title, status, thumbnail, etc.
          });
        });
      }
    });

    // Sort by the most recently updated books first
    return activity.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);
  } catch (error) {
    console.error("Error fetching circle activity:", error);
    return [];
  }
};

export const followUser = async (currentUserId, targetUserId) => {
  try {
    const userRef = doc(db, "users", currentUserId);
    
    await updateDoc(userRef, {
      following: arrayUnion(targetUserId)
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error following scribe:", error);
    return { success: false, error: error.message };
  }
};

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
    const resultsMap = {};

    // Prepare search terms
    // Search for the exact string, and also the first word if user typed a full name
    const terms = searchText.split(" ");
    const mainTerm = terms[0]; 

    // Create multiple queries to cover our bases
    const queries = [
      // Search by Email
      query(usersRef, where("email", "==", searchText.toLowerCase())),
      
      // Search by First Name (Exact)
      query(usersRef, where("firstName", "==", mainTerm)),
      
      // Search by First Name (Prefix - allows "Jan" to find "Jane")
      query(usersRef, where("firstName", ">=", mainTerm), where("firstName", "<=", mainTerm + "\uf8ff"))
    ];

    // Execute all queries in parallel
    const snapshots = await Promise.all(queries.map(q => getDocs(q)));

    // Merge results into the map to handle duplicates
    snapshots.forEach(snap => {
      snap.docs.forEach(doc => {
        resultsMap[doc.id] = { id: doc.id, ...doc.data() };
      });
    });

    return Object.values(resultsMap);
  } catch (error) {
    console.error("Error finding scribes:", error);
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