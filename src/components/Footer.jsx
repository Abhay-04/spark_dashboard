import { Import } from "lucide-react";

import Footer_Logo from "../../public/Footer_Logo.png"

const Footer = () => (
  <footer className="w-full mt-8 flex flex-col items-center">
    {/* Separator Line */}
    <hr className="w-full border-t border-gray-200 mb-4" />
    
    {/* Brand name with colored 'Spark' */}
    <div className="flex flex-col items-center">
      {/* <span className="text-lg font-medium">
        <span className="font-semibold text-purple-500">Spark</span>
        <span className="text-gray-500">onomy</span>
      </span> */}
      <image src={Footer_Logo} alt="Sparkonomy Logo" className="w-16 h-3.5 mb-1" />
      <span className="text-[10px] text-[#999999] mt-1">
        sparking the creator economy
      </span>
    </div>
  </footer>
);
export default Footer;