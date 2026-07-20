import type { Timestamp } from "firebase/firestore";

// /users/{uid}
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  createdAt: Timestamp;
}

// /users/{uid}/books/{bookId}
export type BookStatus = "mau-dibaca" | "sedang-dibaca" | "selesai";

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  status: BookStatus;
  rating?: number; // 0-5, hanya relevan kalau status "selesai"
  notes?: string;
  currentPage?: number;
  totalPages?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// /clubs/{clubId}
export interface Club {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  inviteCode: string;
  memberCount: number;
  createdAt: Timestamp;
}

// /clubs/{clubId}/members/{uid}
export type ClubRole = "owner" | "member";

export interface ClubMember {
  uid: string;
  displayName: string;
  photoURL?: string | null;
  role: ClubRole;
  joinedAt: Timestamp;
  clubName: string;
}

// /clubs/{clubId}/threads/{threadId}
export interface ClubThread {
  id: string;
  title: string;
  bookTitle?: string;
  createdBy: string;
  createdAt: Timestamp;
  lastMessageAt?: Timestamp;
}

// /clubs/{clubId}/threads/{threadId}/messages/{messageId}
export interface ThreadMessage {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: Timestamp;
}