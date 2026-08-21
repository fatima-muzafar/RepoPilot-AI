import Container from "@/components/layout/Container";

async function getHealthData() {
  const response = await fetch("https://api.github.com", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch GitHub API");
  }

  return response.json();
}

export default async function HealthPage() {
  const data = await getHealthData();

  return (
    <Container>
      <section className="py-20">
        <h1 className="text-4xl font-bold">Health Check</h1>

        <div className="mt-8 rounded-xl border border-slate-300 bg-white p-6 text-slate-900 dark:border-[#4A5C6A] dark:bg-[#11212D] dark:text-[#CCD0CF]">
          <p>
            <strong>Status:</strong> Application Running {" "}
            <span aria-hidden="true">✅</span>
          </p>

          <p className="mt-3">
            <strong>GitHub API:</strong> Reachable {" "}
            <span aria-hidden="true">✅</span>
          </p>

          <p className="mt-3">
            <strong>Current User URL:</strong> {data.current_user_url}
          </p>

          <p className="mt-3">
            <strong>Repository URL:</strong> {data.repository_url}
          </p>

          <p className="mt-3">
            <strong>Current Time:</strong>{" "}
            {new Date().toLocaleString()}
          </p>
        </div>
      </section>
    </Container>
  );
}