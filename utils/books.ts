import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firestore";
import type { Book, BookStatus } from "../types/firestore";

function booksRef(userId: string) {
  return collection(db, "users", userId, "books");
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