// src/components/Header.jsx
import { ChevronLeft } from "lucide-react";
import Avatar from "../../public/Avatar.png";
export default function Header() {
  return (
    <header className="flex items-center justify-between py-3 px-2 bg-purple-100 border-rounded-xl mb-2 ">
      <div className="flex items-center space-x-1 cursor-pointer">
        <ChevronLeft className="text-gray-800 text-lg" />

        <span className="text-lg font-medium text-gray-800">Back</span>
      </div>

      <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>

      <img
        src={Avatar}
        alt="User Avatar"
        className="w-10 h-10 rounded-full object-cover"
      />
    </header>
  );
}
