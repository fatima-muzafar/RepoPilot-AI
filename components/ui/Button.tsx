type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${className}`}
      {...props}
    />
  );
}