import {
  addDoc,
  collection,
  collectionGroup,
  doc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Club, ClubMember, ClubThread, ThreadMessage } from "../types/firestore";

function randomInviteCode(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // tanpa karakter yang gampang ketuker (0/O, 1/I)
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// ---------- create / join ----------

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
    clubName: name,
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
    where("inviteCode", "==", inviteCode.trim().toUpperCase()),
    limit(1)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error("Kode undangan tidak ditemukan.");
  }

  const clubDoc = snapshot.docs[0];
  const clubData = clubDoc.data();

  await setDoc(doc(db, "clubs", clubDoc.id, "members", uid), {
    uid,
    displayName,
    photoURL,
    role: "member",
    joinedAt: serverTimestamp(),
    clubName: clubData.name,
  });

  await updateDoc(clubDoc.ref, { memberCount: increment(1) });

  return clubDoc.id;
}

// ---------- reads / subscriptions ----------

/**
 * Klub yang diikuti user, dicari lewat collectionGroup query di semua
 * subcollection "members". Pertama kali query ini jalan, Firestore
 * mungkin minta kamu bikin index khusus (link muncul di console browser) —
 * tinggal klik link-nya sekali, prosesnya otomatis.
 */
export function subscribeToUserClubs(
  uid: string,
  callback: (clubs: (ClubMember & { clubId: string })[]) => void
) {
  const q = query(collectionGroup(db, "members"), where("uid", "==", uid));
  return onSnapshot(q, (snapshot) => {
    const clubs = snapshot.docs.map((d) => ({
      ...(d.data() as ClubMember),
      clubId: d.ref.parent.parent!.id,
    }));
    callback(clubs);
  });
}

export function subscribeToClub(
  clubId: string,
  callback: (club: (Club & { id: string }) | null) => void
) {
  const ref = doc(db, "clubs", clubId);
  return onSnapshot(
    ref,
    (snap) => {
      callback(snap.exists() ? ({ id: snap.id, ...snap.data() } as Club) : null);
    },
    (err) => {
      console.error("subscribeToClub failed:", err);
      callback(null);
    }
  );
}

export function subscribeToClubMembers(
  clubId: string,
  callback: (members: ClubMember[]) => void
) {
  const q = query(
    collection(db, "clubs", clubId, "members"),
    orderBy("joinedAt", "asc")
  );
  return onSnapshot(
    q,
    (snapshot) => callback(snapshot.docs.map((d) => d.data() as ClubMember)),
    (err) => {
      console.error("subscribeToClubMembers failed:", err);
      callback([]);
    }
  );
}

export function subscribeToThreads(
  clubId: string,
  callback: (threads: ClubThread[]) => void
) {
  const q = query(
    collection(db, "clubs", clubId, "threads"),
    orderBy("lastMessageAt", "desc")
  );
  return onSnapshot(
    q,
    (snapshot) =>
      callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ClubThread)),
    (err) => {
      console.error("subscribeToThreads failed:", err);
      callback([]);
    }
  );
}

export function subscribeToMessages(
  clubId: string,
  threadId: string,
  callback: (messages: ThreadMessage[]) => void
) {
  const q = query(
    collection(db, "clubs", clubId, "threads", threadId, "messages"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(
    q,
    (snapshot) =>
      callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ThreadMessage)),
    (err) => {
      console.error("subscribeToMessages failed:", err);
      callback([]);
    }
  );
}

// ---------- writes ----------

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