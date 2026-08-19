import Container from "./Container";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 py-6 dark:border-[#4A5C6A]">
      <Container>
        <p className="text-center text-sm text-gray-500 dark:text-[#9BA8AB]">
          © {new Date().getFullYear()} RepoPilot AI
        </p>
      </Container>
    </footer>
  );
}