// src/components/Header.jsx
import { ChevronLeft } from "lucide-react";
import Avatar from "../../public/Avatar.png";

export default function Header() {
  return (
    <header className="flex items-center justify-center w-full  mb-2  mx-auto  ">
      <div className="flex items-center cursor-pointer ">
        <ChevronLeft className="text-gray-800 text-xs sm:text-sm" />
        <span className="font-medium text-[#212529] text-sm sm:text-lg">Back</span>
      </div>

      <h1 className="font-semibold text-black text-base sm:text-lg flex-grow text-center truncate px-4">
        Dashboard
      </h1>

      <img
        src={Avatar}
        alt="User Avatar"
        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
      />
    </header>
  );
}

