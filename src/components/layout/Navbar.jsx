import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // MOCK DATA: Set to null to see Login/Signup, set to 'Ryo' to see Dashboard/Logout
  const user = null; 

  const handleLogout = () => {
    console.log("Logging out...");
    setIsOpen(false);
  };

  return (
    <nav className="relative bg-primary px-8 py-4 text-white shadow-lg z-50">
      <div className="container mx-auto flex items-center justify-between">
        
        {/* 1. Logo - Stays visible on all screens */}
        <Link to="/" className="text-2xl font-bold tracking-tight z-50">
          UB<span className="text-secondary">Tutor</span>Link
        </Link>

        {/* 2. Desktop Navigation - Hidden on mobile, flex on md (768px+) */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="hover:text-secondary transition-colors font-medium">Home</Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-secondary transition-colors font-medium">Dashboard</Link>
              <button 
                onClick={handleLogout} 
                className="hover:text-accent transition-colors font-medium cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="rounded-md border-2 border-secondary px-5 py-1.5 text-sm font-semibold transition-all hover:bg-secondary hover:text-primary"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="rounded-md bg-accent px-6 py-2 text-sm font-bold shadow-md transition-all hover:bg-red-900 active:scale-95"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* 3. Mobile Toggle Icon - Only visible on small screens */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-3xl z-50 focus:outline-none transition-transform active:scale-90"
          aria-label="Toggle menu"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* 4. Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-0 left-0 w-full h-screen bg-primary p-8 pt-24 flex flex-col gap-6 md:hidden z-40 animate-in fade-in slide-in-from-top-5">
          <Link to="/" onClick={() => setIsOpen(false)} className="text-xl border-b border-white/10 pb-4">Home</Link>
          
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-xl border-b border-white/10 pb-4">My Dashboard</Link>
              <button onClick={handleLogout} className="text-left text-xl text-red-400 font-semibold">Logout</button>
            </>
          ) : (
            <div className="flex flex-col gap-4 mt-4">
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)} 
                className="w-full rounded-md border-2 border-secondary py-3 text-center font-bold text-secondary"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                onClick={() => setIsOpen(false)} 
                className="w-full rounded-md bg-accent py-3 text-center font-bold shadow-lg"
              >
                Join UB Tutor Link
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;