
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { Question, User, UserData, GlobalData, UserProfile } from "../types";

// --- CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyBirFPXET_OdWBHYcICeLJWEFfPxd2GPiA",
  authDomain: "quiz-et.firebaseapp.com",
  projectId: "quiz-et",
  storageBucket: "quiz-et.firebasestorage.app",
  messagingSenderId: "1096659524250",
  appId: "1:1096659524250:web:6aff6c1e14ce6ec31f5d23",
  measurementId: "G-046L0Q81XP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Constants
const GLOBAL_QUESTIONS_ID = "global_quiz_data_v4";
const GLOBAL_USERS_ID = "global_users_registry_v1";
const CACHE_QUESTIONS_KEY = "offline_questions_cache";
const CACHE_USERS_KEY = "offline_users_registry_cache";

// --- OFFLINE / ONLINE HELPERS ---

export const getCachedQuestions = (): Question[] => {
    const cached = localStorage.getItem(CACHE_QUESTIONS_KEY);
    return cached ? JSON.parse(cached) : [];
};

export const getCachedUsers = (): Record<string, UserProfile> => {
    const cached = localStorage.getItem(CACHE_USERS_KEY);
    return cached ? JSON.parse(cached) : {};
};

// --- DATA FETCHING ---

export const fetchGlobalQuestions = async (): Promise<Question[]> => {
    try {
        if (navigator.onLine) {
            const ref = doc(db, "quiz_app", GLOBAL_QUESTIONS_ID);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                const data = snap.data() as GlobalData;
                const questions = data.questions || [];
                // Update Cache
                localStorage.setItem(CACHE_QUESTIONS_KEY, JSON.stringify(questions));
                return questions;
            }
        }
    } catch (e) {
        console.warn("Failed to fetch questions from cloud, falling back to cache.", e);
    }
    // Fallback
    return getCachedQuestions();
};

export const saveGlobalQuestions = async (questions: Question[]): Promise<void> => {
    // Save to local cache immediately
    localStorage.setItem(CACHE_QUESTIONS_KEY, JSON.stringify(questions));
    
    if (!navigator.onLine) {
        throw new Error("Cannot save to cloud while offline. Changes saved locally.");
    }

    await setDoc(doc(db, "quiz_app", GLOBAL_QUESTIONS_ID), { questions });
};

export const fetchAllUsers = async (): Promise<Record<string, UserProfile>> => {
    try {
        if (navigator.onLine) {
            const ref = doc(db, "quiz_app", GLOBAL_USERS_ID);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                const data = snap.data();
                const users = data.users || {};
                localStorage.setItem(CACHE_USERS_KEY, JSON.stringify(users));
                return users;
            }
        }
    } catch (e) {
        console.warn("Failed to fetch users from cloud.", e);
    }
    return getCachedUsers();
};

export const fetchUserData = async (username: string): Promise<UserData> => {
    const defaultData: UserData = { mistakes: [], favorites: [], history: [], session: null };
    const cacheKey = `user_data_${username}`;

    try {
        if (navigator.onLine) {
            const ref = doc(db, "quiz_app", `user_${username}`);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                const data = snap.data() as UserData;
                // Ensure favorites exists if loading old data
                if (!data.favorites) data.favorites = [];
                localStorage.setItem(cacheKey, JSON.stringify(data));
                return data;
            }
        }
    } catch (e) {
        console.warn(`Failed to fetch data for ${username}`, e);
    }
    
    const cached = localStorage.getItem(cacheKey);
    return cached ? JSON.parse(cached) : defaultData;
};

export const saveUserData = async (username: string, data: UserData): Promise<void> => {
    const cacheKey = `user_data_${username}`;
    localStorage.setItem(cacheKey, JSON.stringify(data));

    if (navigator.onLine) {
        await setDoc(doc(db, "quiz_app", `user_${username}`), data, { merge: true });
    }
};

export const updateUserProfile = async (username: string, updates: Partial<UserProfile>): Promise<void> => {
    // Optimistic update for cache
    const users = getCachedUsers();
    if (users[username]) {
        users[username] = { ...users[username], ...updates };
        localStorage.setItem(CACHE_USERS_KEY, JSON.stringify(users));
    }

    if (navigator.onLine) {
        const registryRef = doc(db, "quiz_app", GLOBAL_USERS_ID);
        const freshUsers = await fetchAllUsers();
        if(freshUsers[username]) {
            freshUsers[username] = { ...freshUsers[username], ...updates };
            await setDoc(registryRef, { users: freshUsers }, { merge: true });
        }
    }
};

export const createNewUser = async (username: string, profile: UserProfile): Promise<void> => {
    const users = await fetchAllUsers();
    if (users[username]) throw new Error("User already exists");
    
    users[username] = {
        ...profile,
        suspended: false,
        theme: 'indigo',
        shuffleAnswers: false
    };
    
    // Update cache
    localStorage.setItem(CACHE_USERS_KEY, JSON.stringify(users));
    
    if (navigator.onLine) {
        await setDoc(doc(db, "quiz_app", GLOBAL_USERS_ID), { users }, { merge: true });
    }
};

export const renameUser = async (oldUsername: string, newUsername: string): Promise<void> => {
    const users = await fetchAllUsers();
    
    if (users[newUsername]) throw new Error("Το όνομα χρησιμοποιείται ήδη.");
    if (!users[oldUsername]) throw new Error("Ο χρήστης δεν βρέθηκε.");

    const profile = users[oldUsername];
    
    // 1. Update Registry
    users[newUsername] = profile;
    delete users[oldUsername];
    
    // Update local cache immediately
    localStorage.setItem(CACHE_USERS_KEY, JSON.stringify(users));

    if (navigator.onLine) {
        await setDoc(doc(db, "quiz_app", GLOBAL_USERS_ID), { users }); // Overwrite with full new object
    }

    // 2. Move User Data (Mistakes, Favorites, History)
    // We fetch the old data and save it to the new key
    const userData = await fetchUserData(oldUsername);
    await saveUserData(newUsername, userData);
    
    // Note: We are not deleting the old user_{oldUsername} doc in Firestore to keep it simple and avoiding complex permissions/logic
    // but we remove it from local cache
    localStorage.removeItem(`user_data_${oldUsername}`);
};
