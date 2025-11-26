
import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface CreateViewProps {
  // Props if needed later
}

export const CreateView: React.FC<CreateViewProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login action
    handleCloseModal();
  };

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden relative font-sans">
      
      {/* Header */}
      <div className="px-8 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
        <h1 className="font-bold text-slate-900 text-lg">Creator Hub</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 text-slate-700 text-xs font-bold rounded-full hover:bg-gray-50 transition-colors">
            Creator Academy
          </button>
          <button 
            onClick={handleOpenModal}
            className="px-4 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-slate-800 transition-colors shadow-sm"
          >
            Create guide
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="min-h-full flex flex-col">
          
          {/* Hero Section */}
          <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-xl shadow-pink-200 mb-8">
              <div className="border-2 border-white rounded-lg p-1">
                <Plus className="text-white" size={24} strokeWidth={3} />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Create beautiful guides.</h2>
            <p className="text-slate-500 mb-8 font-normal text-lg">
              Share your local expertise with others.
            </p>
            
            <button 
              onClick={handleOpenModal}
              className="px-8 py-3 bg-slate-900 text-white font-medium rounded-full hover:bg-slate-800 transition-all shadow-lg active:scale-95"
            >
              Create guide
            </button>
          </div>

          {/* Inspiration Gallery */}
          <div className="w-full px-4 pb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-64 md:h-80">
              <div className="rounded-2xl overflow-hidden relative group">
                <img 
                  src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=600" 
                  alt="Temple" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
              </div>
              <div className="rounded-2xl overflow-hidden relative group">
                <img 
                  src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600" 
                  alt="Nature" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                 <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
              </div>
              <div className="rounded-2xl overflow-hidden relative group">
                <img 
                  src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=600" 
                  alt="Cave" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                 <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
              </div>
              <div className="rounded-2xl overflow-hidden relative group">
                <img 
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600" 
                  alt="Ocean" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                 <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
              </div>
            </div>
            
            <div className="text-center mt-12 mb-4">
              <a href="#" className="text-xs text-slate-500 underline decoration-slate-300 hover:text-slate-900">
                Creator Program Terms and Conditions
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>

            <div className="text-center mb-8">
              <div className="text-4xl mb-4">👋</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Create a guide</h2>
              <p className="text-slate-500 text-sm">Just enter your email to sign up or log in to DMC Suite.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-slate-900 focus:ring-0 outline-none transition-colors"
                autoFocus
              />
              
              <button 
                type="submit"
                className="w-full py-3 bg-black text-white font-bold rounded-full hover:bg-slate-800 transition-colors"
              >
                Continue
              </button>
            </form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <span className="relative bg-white px-3 text-xs text-gray-400 font-medium uppercase">or</span>
            </div>

            <div className="space-y-3">
              <button className="w-full py-3 border border-gray-300 rounded-full flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors font-medium text-slate-700 text-sm">
                 <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                 Continue with Google
              </button>
              <button className="w-full py-3 border border-gray-300 rounded-full flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors font-medium text-slate-700 text-sm">
                 <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"/></svg>
                 Continue with Apple
              </button>
            </div>

            <p className="text-[10px] text-gray-400 text-center mt-6 leading-tight">
              By continuing, you agree to DMC Suite’s <span className="font-bold text-gray-500">Terms of Service</span> and acknowledge you’ve read our <span className="font-bold text-gray-500">Privacy Policy</span>.
            </p>

          </div>
        </div>
      )}

    </div>
  );
};