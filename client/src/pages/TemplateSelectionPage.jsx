import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config'
import { FALLBACK_PRODUCTS } from '../data/fallbackProducts'
import useStore from '../store/useStore'

export default function TemplateSelectionPage() {
  const { sport } = useParams()
  const navigate = useNavigate()
  const user = useStore(state => state.user)
  const logout = useStore(state => state.logout)
  const [products, setProducts] = useState(FALLBACK_PRODUCTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => { if (!res.ok) throw new Error('API error'); return res.json() })
      .then(data => {
        if (data && data.length > 0) {
          setProducts(data)
        }
      })
      .catch(() => {
        setProducts(FALLBACK_PRODUCTS)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const currentSport = sport || 'baseball'
  const filteredTemplates = products.filter(
    p => p.category?.toLowerCase() === currentSport.toLowerCase()
  )

  const handleSelectTemplate = (prod) => {
    navigate(`/builder/${prod._id || prod.id}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getSportEmoji = (sp) => sp.toLowerCase() === 'baseball' ? '⚾' : '🏀'
  
  const getTemplateIcon = (name) => {
    const n = name.toLowerCase()
    if (n.includes('jersey')) return '👕'
    if (n.includes('cap')) return '🧢'
    if (n.includes('pants')) return '👖'
    if (n.includes('shorts')) return '🩳'
    if (n.includes('hoodie')) return '🧥'
    return '👕'
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
            Step 2 of 2
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
      <main className="flex-1 flex flex-col items-start justify-start px-6 py-12 max-w-6xl mx-auto w-full relative z-10 space-y-8">
        <button
          onClick={() => navigate('/sports')}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-semibold group bg-white hover:bg-blue-50/50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition-all"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span> Back to Categories
        </button>

        <div className="space-y-3 w-full text-left">
          <span className="px-3 py-1 text-xs rounded-full bg-blue-50 border border-blue-100 font-extrabold uppercase tracking-widest text-blue-700 inline-block capitalize">
            {getSportEmoji(currentSport)} {currentSport} Category
          </span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 uppercase">
            Select a Product Template
          </h2>
          <p className="text-slate-500 text-sm max-w-xl font-medium leading-relaxed">
            Choose a starting structural template to customize in the real-time 3D workspace. You'll be able to design colors, add custom text, upload logos, and apply overlay patterns.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-200/80 rounded-3xl p-6 h-80 animate-pulse flex flex-col justify-between shadow-sm">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl" />
                  <div className="h-6 bg-slate-100 rounded w-2/3" />
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="h-4 bg-slate-100 rounded w-5/6" />
                </div>
                <div className="h-11 bg-slate-100 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-6">
            {filteredTemplates.map((prod) => (
              <div
                key={prod._id || prod.id}
                className="group relative bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between hover:border-blue-400 hover:shadow-[0_15px_30px_rgba(59,130,246,0.06)] transition-all duration-300 shadow-sm animate-fade-in"
              >
                <div className="flex flex-col gap-5">
                  {/* Visual Icon Box */}
                  <div className="w-16 h-16 rounded-2xl bg-blue-50/80 border border-blue-100/80 flex items-center justify-center text-4xl group-hover:scale-105 group-hover:bg-blue-100/50 transition-all duration-300">
                    {getTemplateIcon(prod.name)}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium min-h-[40px] group-hover:text-slate-500 transition-colors">
                      {prod.description || `Premium customizable ${prod.name.toLowerCase()} design layout.`}
                    </p>
                  </div>

                  <div className="border-t border-slate-100/80 pt-4">
                    <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                      Customizable Zones
                    </span>
                    <div className="flex gap-1.5 flex-wrap mt-2">
                      {prod.colorZones?.map((z) => (
                        <span
                          key={z}
                          className="px-2.5 py-0.75 text-[10px] font-semibold rounded-md bg-slate-50 text-slate-600 capitalize border border-slate-100 hover:bg-slate-100 hover:text-slate-700 transition-all"
                        >
                          {z}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSelectTemplate(prod)}
                  className="w-full mt-6 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all text-center text-sm flex items-center justify-center gap-1.5 shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300"
                >
                  <span>Customize in 3D</span>
                  <span className="text-base group-hover:scale-110 transition-transform">✨</span>
                </button>
              </div>
            ))}
            {filteredTemplates.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400 bg-white border border-slate-200 rounded-3xl w-full">
                <span className="text-3xl block mb-2">🔍</span>
                <p className="font-semibold text-sm">No templates found for "{currentSport}"</p>
                <p className="text-xs text-slate-400 mt-1">Please try returning to sports selection.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200/80 bg-white text-center text-xs text-slate-400 relative z-10 font-medium">
        3D Product Builder Customizer &copy; {new Date().getFullYear()} · All rights reserved.
      </footer>
    </div>
  )
}
