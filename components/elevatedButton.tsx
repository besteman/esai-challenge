"use client";

interface ElevatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export const ElevatedButton = ({
  children,
  onClick,
  className = "",
  disabled = false,
  type = "button",
}: ElevatedButtonProps) => {
  return (
    <button
      className={`relative ${className}`}
      disabled={disabled}
      type={type}
      onClick={onClick}
    >
      <span className="absolute top-0 left-0 mt-1 ml-1 h-full w-full rounded bg-black" />
      <span
        className="fold-bold relative inline-block h-full w-full rounded border-2 border-black bg-white px-10 py-1 text-base font-bold text-black transition duration-100 hover:text-gray-900"
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#81F495")
        }
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
      >
        {children}
      </span>
    </button>
  );
};
