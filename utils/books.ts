import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Book, BookStatus } from "../types/firestore";

function booksRef(userId: string) {
  return collection(db, "users", userId, "books");
}

/**
 * Live-subscribe ke daftar buku user. Return function unsubscribe —
 * WAJIB dipanggil di cleanup useEffect biar gak leak listener.
 */
export function subscribeToBooks(
  userId: string,
  callback: (books: Book[]) => void
) {
  const q = query(booksRef(userId), orderBy("updatedAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const books = snapshot.docs.map(
      (d) => ({ id: d.id, ...d.data() }) as Book
    );
    callback(books);
  });
}

export async function addBook(
  userId: string,
  data: Pick<Book, "title" | "author" | "status"> &
    Partial<Pick<Book, "coverUrl" | "totalPages">>
) {
  const ref = await addDoc(booksRef(userId), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export function subscribeToBook(
  userId: string,
  bookId: string,
  callback: (book: Book | null) => void
) {
  const ref = doc(db, "users", userId, "books", bookId);
  return onSnapshot(ref, (snap) => {
    callback(snap.exists() ? ({ id: snap.id, ...snap.data() } as Book) : null);
  });
}

export async function updateBook(
  userId: string,
  bookId: string,
  data: Partial<
    Pick<
      Book,
      "status" | "rating" | "notes" | "currentPage" | "totalPages"
    >
  >
) {
  const ref = doc(db, "users", userId, "books", bookId);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function setBookStatus(
  userId: string,
  bookId: string,
  status: BookStatus
) {
  await updateBook(userId, bookId, { status });
}

export async function deleteBook(userId: string, bookId: string) {
  const ref = doc(db, "users", userId, "books", bookId);
  await deleteDoc(ref);
}