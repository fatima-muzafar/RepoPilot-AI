import PlaceholderPage from "@/components/shared/PlaceholderPage";

type Props = {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
};

export default async function RepositoryPage({ params }: Props) {
  const { owner, repo } = await params;

  return (
    <PlaceholderPage
      title={`${owner}/${repo}`}
      description="Repository details will appear here."
    />
  );
}