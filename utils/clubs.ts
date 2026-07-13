import {
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firestore";

function randomInviteCode(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // tanpa karakter yang gampang ketuker (0/O, 1/I)
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createClub(
  ownerId: string,
  ownerName: string,
  ownerPhotoURL: string | null,
  name: string,
  description?: string
) {
  const clubRef = doc(collection(db, "clubs"));

  await setDoc(clubRef, {
    name,
    description: description ?? "",
    ownerId,
    inviteCode: randomInviteCode(),
    memberCount: 1,
    createdAt: serverTimestamp(),
  });

  // Owner otomatis jadi member pertama.
  await setDoc(doc(db, "clubs", clubRef.id, "members", ownerId), {
    uid: ownerId,
    displayName: ownerName,
    photoURL: ownerPhotoURL,
    role: "owner",
    joinedAt: serverTimestamp(),
  });

  return clubRef.id;
}

export async function joinClubByInviteCode(
  uid: string,
  displayName: string,
  photoURL: string | null,
  inviteCode: string
) {
  const q = query(
    collection(db, "clubs"),
    where("inviteCode", "==", inviteCode.toUpperCase()),
    limit(1)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error("Kode undangan tidak ditemukan.");
  }

  const clubDoc = snapshot.docs[0];

  await setDoc(doc(db, "clubs", clubDoc.id, "members", uid), {
    uid,
    displayName,
    photoURL,
    role: "member",
    joinedAt: serverTimestamp(),
  });

  await updateDoc(clubDoc.ref, { memberCount: increment(1) });

  return clubDoc.id;
}

export async function createThread(
  clubId: string,
  createdBy: string,
  title: string,
  bookTitle?: string
) {
  const ref = await addDoc(collection(db, "clubs", clubId, "threads"), {
    title,
    bookTitle: bookTitle ?? "",
    createdBy,
    createdAt: serverTimestamp(),
    lastMessageAt: serverTimestamp(),
  });
  return ref.id;
}

export async function sendMessage(
  clubId: string,
  threadId: string,
  authorId: string,
  authorName: string,
  text: string
) {
  await addDoc(
    collection(db, "clubs", clubId, "threads", threadId, "messages"),
    {
      authorId,
      authorName,
      text,
      createdAt: serverTimestamp(),
    }
  );

  await updateDoc(doc(db, "clubs", clubId, "threads", threadId), {
    lastMessageAt: serverTimestamp(),
  });
}