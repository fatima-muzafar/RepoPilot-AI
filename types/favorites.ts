import type { RepositorySummary } from "@/types/repository";

export interface FavoriteRepository extends RepositorySummary {
  savedAt: unknown;
}