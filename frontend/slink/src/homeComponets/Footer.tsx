const Footer = () => {
  return (
    <footer className="bg-green-100 text-gray-300 font-bbh border-t border-green-500/30">
       
      {/* Bottom Bar */}
      <div className="border-green-500/20 mt-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center px-6 py-1 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Slink. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-green-400 transition">Twitter</a>
            <a href="#" className="hover:text-green-400 transition">Discord</a>
            <a href="#" className="hover:text-green-400 transition">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
