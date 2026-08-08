import AccessibleDisclosure from "@/playground/disclosure/AccessibleDisclosure";
import AccessibleTabs from "@/playground/tabs/AccessibleTabs";
import AccessibleModal from "@/playground/modal/AccessibleModal";

export default function PlaygroundPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          FE-05 Accessibility Playground
        </h1>

        <p className="mb-10 text-gray-600">
          Accessible React components built from scratch using
          ARIA patterns.
        </p>

        {/* Disclosure */}
        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            1. Disclosure
          </h2>

          <p className="mb-5 text-sm text-gray-500">
            Expandable content controlled by an accessible button.
          </p>

          <AccessibleDisclosure />
        </section>

        {/* Tabs */}
        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            2. Tabs
          </h2>

          <p className="mb-5 text-sm text-gray-500">
            Navigate between tabs using Tab, Arrow keys, Home,
            and End.
          </p>

          <AccessibleTabs />
        </section>

        {/* Modal */}
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            3. Modal Dialog
          </h2>

          <p className="mb-5 text-sm text-gray-500">
            Demonstrates focus management, focus trapping, and
            Escape-to-close behavior.
          </p>

          <AccessibleModal />
        </section>
      </div>
    </main>
  );
}