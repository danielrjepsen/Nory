interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  variant?: 'sidebar' | 'mobile';
}

export const NavButton = ({ icon, label, isActive, onClick, variant = 'sidebar' }: NavButtonProps) => {
  const baseClasses = "flex items-center gap-3 w-full rounded-xl font-semibold transition-all";

  const variantClasses = {
    sidebar: "px-4 py-3 mb-1 text-[15px]",
    mobile: "px-4 py-3 mb-2 text-base"
  };

  const activeClasses = isActive
    ? "bg-gray-900 text-white"
    : "text-gray-500 hover:bg-white/50 hover:text-gray-700";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${activeClasses}`}
    >
      {icon}
      {label}
    </button>
  );
};
