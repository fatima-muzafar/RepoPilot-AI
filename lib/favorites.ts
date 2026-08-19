import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { RepositorySummary } from "@/types/repository";

function favoritesCollection(userId: string) {
  return collection(db, "users", userId, "favorites");
}

function favoriteDocument(userId: string, repositoryId: number) {
  return doc(
    db,
    "users",
    userId,
    "favorites",
    String(repositoryId),
  );
}

export async function isFavorite(
  userId: string,
  repositoryId: number,
): Promise<boolean> {
  const snapshot = await getDoc(
    favoriteDocument(userId, repositoryId),
  );

  return snapshot.exists();
}

export async function saveFavorite(
  userId: string,
  repository: RepositorySummary,
): Promise<void> {
  await setDoc(
    favoriteDocument(userId, repository.id),
    {
      ...repository,
      savedAt: serverTimestamp(),
    },
  );
}

export async function removeFavorite(
  userId: string,
  repositoryId: number,
): Promise<void> {
  await deleteDoc(
    favoriteDocument(userId, repositoryId),
  );
}

export async function getFavorites(
  userId: string,
): Promise<RepositorySummary[]> {
  const snapshot = await getDocs(
    favoritesCollection(userId),
  );

  return snapshot.docs
    .map((favorite) => favorite.data() as RepositorySummary)
    .sort((a, b) => a.name.localeCompare(b.name));
}