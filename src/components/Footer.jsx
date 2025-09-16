const Footer = () => (
  <footer className="w-full mt-8 flex flex-col items-center">
    {/* Separator Line */}
    <hr className="w-full border-t border-gray-200 mb-4" />
    
    {/* Brand name with colored 'Spark' */}
    <div className="flex flex-col items-center">
      <span className="text-lg font-medium">
        <span className="font-semibold text-purple-500">Spark</span>
        <span className="text-gray-500">onomy</span>
      </span>
      <span className="text-sm text-gray-400 mt-1">
        sparking the creator economy
      </span>
    </div>
  </footer>
);
export default Footer;