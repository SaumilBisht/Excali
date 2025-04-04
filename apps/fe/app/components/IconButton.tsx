import { ReactNode, useState, useRef } from "react";

export function IconButton({ icon, onClick, activated, text }: {
  icon: ReactNode;
  onClick: () => void;
  activated: boolean;
  text: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => {
        timeoutRef.current = setTimeout(() => setShowTooltip(true), 500);
      }}
      onMouseLeave={() => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);// Prevent tooltip from showing if mouse leaves early
          timeoutRef.current = null;
        }
        setShowTooltip(false);
      }}
      className={`relative flex items-center justify-center rounded-full border p-2 m-2 cursor-pointer 
        hover:text-gray-400 ${activated ? "text-red-600" : "text-white"}`}
    >
      {icon}

      {showTooltip && (
        <div className="absolute top-full mt-2 w-max bg-[#222] text-white text-sm px-3 py-1 rounded-lg opacity-90">
          {text}
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full border-4 border-transparent border-b-[#222]"></div>
          
        </div>
      )}
    </div>
  );
}