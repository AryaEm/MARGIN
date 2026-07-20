import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import type { User as FirebaseUser } from "firebase/auth";
import { db } from "./firebase";

/**
 * Dipanggil setiap kali user login (termasuk login berikutnya).
 * Dokumen baru → set lengkap dengan createdAt.
 * Dokumen sudah ada → cuma update field yang bisa berubah di Google,
 * createdAt asli tidak disentuh.
 */
export async function upsertUserProfile(user: FirebaseUser) {
  const ref = doc(db, "users", user.uid);
  const existing = await getDoc(ref);

  const profileFields = {
    uid: user.uid,
    displayName: user.displayName ?? "",
    email: user.email ?? "",
    photoURL: user.photoURL ?? null,
  };

  if (existing.exists()) {
    await setDoc(ref, profileFields, { merge: true });
  } else {
    await setDoc(ref, { ...profileFields, createdAt: serverTimestamp() });
  }
}