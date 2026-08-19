type CardProps = {
  children: React.ReactNode;
};

export default function Card({ children }: CardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#4A5C6A] dark:bg-[#11212D]">
      {children}
    </div>
  );
}