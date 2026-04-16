import { 
  collection, query, where, getDocs, doc, updateDoc, 
  arrayUnion, setDoc, deleteDoc, serverTimestamp 
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

// --- REVIEWS ---

export const saveReview = async (userId, bookId, reviewData) => {
  try {
    const reviewId = `${userId}_${bookId}`;
    const reviewRef = doc(db, "reviews", reviewId);
    const userRef = doc(db, "users", userId);

    // Save to the global reviews collection
    await setDoc(reviewRef, {
      ...reviewData,
      userId,
      bookId,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    // Update the specific book in the user's library to 'reviewed'
    await updateDoc(userRef, {
      [`library.${bookId}.status`]: 'reviewed',
      [`library.${bookId}.rating`]: reviewData.rating,
      [`library.${bookId}.reviewText`]: reviewData.text,
      [`library.${bookId}.updatedAt`]: new Date().toISOString()
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving review:", error);
    return { success: false, error: error.message };
  }
};

export const getBookReviews = async (bookId) => {
  try {
    const q = query(collection(db, "reviews"), where("bookId", "==", bookId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).sort((a, b) => b.updatedAt - a.updatedAt); 
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

export const deleteReview = async (userId, bookId) => {
  try {
    const reviewId = `${userId}_${bookId}`;
    const userRef = doc(db, "users", userId);

    await deleteDoc(doc(db, "reviews", reviewId));

    await updateDoc(userRef, {
      [`library.${bookId}.status`]: 'read',
      [`library.${bookId}.updatedAt`]: new Date().toISOString()
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    return { success: false, error: error.message };
  }
};

// --- SOCIAL ---

export const getCircleActivity = async (followingIds) => {
  if (!followingIds || followingIds.length === 0) return [];

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("__name__", "in", followingIds));
    const querySnapshot = await getDocs(q);

    let activity = [];

    querySnapshot.docs.forEach(doc => {
      const userData = doc.data();
      if (userData.library) {
        Object.values(userData.library).forEach(book => {
          activity.push({
            scribeName: `${userData.firstName} ${userData.lastName}`,
            scribePhoto: userData.photoURL,
            ...book 
          });
        });
      }
    });

    return activity.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 10);
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
    return { success: false, error: error.message };
  }
};

// --- LEDGER MANAGEMENT ---

export const updateBookStatus = async (userId, bookData, status) => {
  try {
    const userRef = doc(db, "users", userId);
    
    await updateDoc(userRef, {
      [`library.${bookData.id}`]: {
        id: bookData.id,
        title: bookData.volumeInfo.title,
        authors: bookData.volumeInfo.authors || ["Unknown Author"],
        thumbnail: bookData.volumeInfo.imageLinks?.thumbnail || "",
        status: status, 
        updatedAt: new Date().toISOString()
      }
    });
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// --- PROFILE & STORAGE ---

export const uploadProfilePicture = async (userId, file) => {
  try {
    const storageRef = ref(storage, `profile_pictures/${userId}`);
    await uploadBytes(storageRef, file);
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
    const mainTerm = searchText.split(" ")[0]; 

    const queries = [
      query(usersRef, where("email", "==", searchText.toLowerCase())),
      query(usersRef, where("firstName", "==", mainTerm)),
      query(usersRef, where("firstName", ">=", mainTerm), where("firstName", "<=", mainTerm + "\uf8ff"))
    ];

    const snapshots = await Promise.all(queries.map(q => getDocs(q)));
    snapshots.forEach(snap => {
      snap.docs.forEach(doc => {
        resultsMap[doc.id] = { id: doc.id, ...doc.data() };
      });
    });

    return Object.values(resultsMap);
  } catch (error) {
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