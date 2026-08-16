import Link from "next/link";

import Container from "@/components/layout/Container";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function FavoritesPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <Container>
        <div className="mx-auto max-w-3xl">
          <Card>
            <div className="py-12 text-center">
              <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
                Favorites
              </p>

              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                No saved repositories yet
              </h1>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">
                Explore repositories and come back here when you
                have something you want to save.
              </p>

              <Link href="/search" className="mt-6 inline-block">
                <Button type="button">
                  Explore repositories
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </Container>
    </main>
  );
}