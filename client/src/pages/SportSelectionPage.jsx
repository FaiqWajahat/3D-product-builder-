import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'

export default function SportSelectionPage() {
  const navigate = useNavigate()
  const user = useStore(state => state.user)
  const logout = useStore(state => state.logout)

  const handleSelectSport = (sport) => {
    navigate(`/templates/${sport}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Decorative Light Gradients */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="py-4 px-8 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm relative z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <span className="text-lg font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
            3D PRODUCT BUILDER
          </span>
          <span className="px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider bg-blue-50 text-blue-700 rounded border border-blue-100">
            Customizer
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] bg-slate-100 px-2 py-1 rounded hidden sm:inline">
            Step 1 of 2
          </span>
          {user && (
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="flex flex-col text-right leading-none">
                <span className="font-semibold text-gray-800 text-xs">{user.name}</span>
                <span className="text-[10px] text-gray-400 mt-0.5">Designer Account</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 font-bold transition-colors hover:bg-red-50 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-red-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 max-w-5xl mx-auto w-full relative z-10">
        <div className="w-full text-center space-y-12">
          
          <div className="space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Getting Started
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-slate-900">
              SELECT YOUR <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">CATEGORY</span>
            </h1>
            <p className="text-slate-500 max-w-md mx-auto text-sm md:text-base font-medium leading-relaxed">
              Begin by choosing a sport category below. You will be able to customize high-fidelity 3D templates with colors, logos, names, and patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mt-10">
            {/* Baseball Sport Card */}
            <button
              onClick={() => handleSelectSport('baseball')}
              className="group relative h-80 rounded-3xl overflow-hidden border border-slate-200/80 bg-white p-8 flex flex-col justify-between text-left hover:border-blue-500 hover:shadow-[0_20px_40px_rgba(59,130,246,0.08)] transition-all duration-300 shadow-sm"
            >
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 rounded-2xl bg-blue-50/80 border border-blue-100/80 flex items-center justify-center text-4xl group-hover:scale-110 group-hover:bg-blue-100/50 transition-all duration-300">
                  ⚾
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-blue-600 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full transition-all">
                  3 Templates
                </span>
              </div>

              <div className="space-y-3 mt-auto">
                <div className="flex flex-wrap gap-1">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Jerseys</span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Pants</span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Caps</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-800 group-hover:text-blue-600 transition-colors">
                  Baseball Customizer
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium group-hover:text-slate-500 transition-colors">
                  Build classic button-down uniforms, custom fitting cap templates, and striped baseball trousers with complete 3D texturing control.
                </p>
              </div>
              
              {/* Arrow indicator */}
              <div className="absolute bottom-8 right-8 w-11 h-11 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-300 shadow-md shadow-blue-200/50">
                <span className="text-blue-500 font-black group-hover:text-white">→</span>
              </div>
            </button>

            {/* Basketball Sport Card */}
            <button
              onClick={() => handleSelectSport('basketball')}
              className="group relative h-80 rounded-3xl overflow-hidden border border-slate-200/80 bg-white p-8 flex flex-col justify-between text-left hover:border-blue-500 hover:shadow-[0_20px_40px_rgba(59,130,246,0.08)] transition-all duration-300 shadow-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 rounded-2xl bg-blue-50/80 border border-blue-100/80 flex items-center justify-center text-4xl group-hover:scale-110 group-hover:bg-blue-100/50 transition-all duration-300">
                  🏀
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-blue-600 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full transition-all">
                  3 Templates
                </span>
              </div>

              <div className="space-y-3 mt-auto">
                <div className="flex flex-wrap gap-1">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Jerseys</span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Shorts</span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Hoodies</span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-800 group-hover:text-blue-600 transition-colors">
                  Basketball Customizer
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium group-hover:text-slate-500 transition-colors">
                  Design athletic sleeveless jerseys, comfortable training shorts, and heavyweight hoodies with full player customization.
                </p>
              </div>

              {/* Arrow indicator */}
              <div className="absolute bottom-8 right-8 w-11 h-11 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-300 shadow-md shadow-blue-200/50">
                <span className="text-blue-500 font-black group-hover:text-white">→</span>
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-400 relative z-10 font-medium">
        3D Product Builder Customizer &copy; {new Date().getFullYear()} · All rights reserved.
      </footer>
    </div>
  )
}
