interface RepositoryToolResultProps {
  name: string;
  fullName: string;
  owner: string;
  description: string | null;
  stars: number;
  forks: number;
  watchers: number;
  language: string | null;
  license: string | null;
  topics: string[];
  url: string;
}

export default function RepositoryToolResult({
  fullName,
  description,
  stars,
  forks,
  watchers,
  language,
  license,
  topics,
  url,
}: RepositoryToolResultProps) {
  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Repository information
      </p>

      <h3 className="mt-1 text-base font-semibold text-slate-900">
        {fullName}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {description ?? "No description provided."}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <p className="text-xs text-slate-500">Stars</p>
          <p className="font-semibold text-slate-900">
            {stars.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Forks</p>
          <p className="font-semibold text-slate-900">
            {forks.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Watchers</p>
          <p className="font-semibold text-slate-900">
            {watchers.toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Language</p>
          <p className="font-semibold text-slate-900">
            {language ?? "Unknown"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
          {license ?? "No license"}
        </span>

        {topics.slice(0, 5).map((topic) => (
          <span
            key={topic}
            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
          >
            {topic}
          </span>
        ))}
      </div>

      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-block text-sm font-medium text-slate-900 underline"
      >
        View on GitHub
      </a>
    </div>
  );
}