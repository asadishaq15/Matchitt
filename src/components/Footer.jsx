const Footer = () => {
  return (
    <footer className="bg-burgundy py-20 text-cream overflow-hidden relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="lg:col-span-2">
            <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to <span className="text-accent-blue italic">Match?</span></h2>
            <p className="text-cream/60 text-lg max-w-md mb-10">
              Let's create something extraordinary together. Reach out and tell us about your vision.
            </p>
            <div className="flex gap-4">
              <button className="bg-cream text-burgundy px-8 py-3 rounded-full font-bold hover:bg-accent-blue transition-colors">
                Start a Project
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs text-cream/40 mb-6">Contact</h4>
            <ul className="flex flex-col gap-4 text-lg">
              <li className="hover:text-accent-blue cursor-pointer transition-colors">hello@matchitt.com</li>
              <li className="hover:text-accent-blue cursor-pointer transition-colors">+1 (555) 000-1234</li>
              <li className="hover:text-accent-blue cursor-pointer transition-colors">New York, NY</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs text-cream/40 mb-6">Follow</h4>
            <ul className="flex flex-col gap-4 text-lg">
              <li className="hover:text-accent-blue cursor-pointer transition-colors">Instagram</li>
              <li className="hover:text-accent-blue cursor-pointer transition-colors">Twitter</li>
              <li className="hover:text-accent-blue cursor-pointer transition-colors">LinkedIn</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-cream/40">© 2024 MATCHITT STUDIO. ALL RIGHTS RESERVED.</p>
          <h1 className="text-4xl md:text-8xl font-black text-cream/5 absolute bottom-0 right-0 translate-y-1/2 select-none">
            MATCHITT
          </h1>
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-blue/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
    </footer>
  );
};

export default Footer;
