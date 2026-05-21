import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { API_BASE_URL } from '../config'
import { FALLBACK_PRODUCTS } from '../data/fallbackProducts'
import ModelViewer from '../components/three/ModelViewer'
import ProductSelector from '../components/ui/ProductSelector'
import ColorPanel from '../components/ui/ColorPanel'
import TextPanel from '../components/ui/TextPanel'
import LogoPanel from '../components/ui/LogoPanel'
import PatternPanel from '../components/ui/PatternPanel'
import DesignSummary from '../components/ui/DesignSummary'
import BuilderHeader from '../components/ui/BuilderHeader'
import SavedDesignsModal from '../components/ui/SavedDesignsModal'
import QuoteModal from '../components/ui/QuoteModal'

const CONTROL_TABS = [
  { id: 'colors',  label: 'Colors',  icon: '🎨' },
  { id: 'text',    label: 'Text',    icon: 'T'  },
  { id: 'logo',    label: 'Logo',    icon: '↑'  },
  { id: 'pattern', label: 'Pattern', icon: '▦'  },
]

const TAB_STEP = { colors: 1, text: 2, logo: 3, pattern: 4 }

export default function BuilderPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  
  // Helper to determine initial loading state
  const getInitialLoading = (id) => {
    if (!id) return false
    const currentProd = useStore.getState().selectedProduct
    if (currentProd && (currentProd.id === id || currentProd._id === id)) {
      return false
    }
    const saved = localStorage.getItem('savedDesign')
    if (saved) {
      try {
        const snapshot = JSON.parse(saved)
        if (snapshot.selectedProduct && (snapshot.selectedProduct.id === id || snapshot.selectedProduct._id === id)) {
          return false
        }
      } catch { /* ignore */ }
    }
    return true
  }

  // Initialize loading based on current product state to avoid flicker/delay
  const [loading, setLoading] = useState(() => getInitialLoading(productId))
  const [prevProductId, setPrevProductId] = useState(productId)

  if (productId !== prevProductId) {
    setPrevProductId(productId)
    setLoading(getInitialLoading(productId))
  }

  const [activeTab, setActiveTab] = useState('colors')
  const [activeMobileTab, setActiveMobileTab] = useState('customize') // 'product', 'customize', 'review'
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [showSavedModal, setShowSavedModal] = useState(false)
  const selectedProduct = useStore(state => state.selectedProduct)
  const token = useStore(state => state.token)

  useEffect(() => {
    if (!productId) {
      navigate('/sports', { replace: true })
      return
    }

    // Try loading design snapshot from localStorage if it matches
    const saved = localStorage.getItem('savedDesign')
    if (saved) {
      try {
        const snapshot = JSON.parse(saved)
        if (snapshot.selectedProduct && (snapshot.selectedProduct.id === productId || snapshot.selectedProduct._id === productId)) {
          useStore.getState().loadDesignSnapshot(snapshot)
          return
        }
      } catch (err) {
        console.error('Failed to parse saved design snapshot:', err)
      }
    }

    // Check if store's active product matches
    const currentProd = useStore.getState().selectedProduct
    if (currentProd && (currentProd.id === productId || currentProd._id === productId)) {
      return
    }

    // Otherwise, fetch product template asynchronously
    fetch(`${API_BASE_URL}/api/products/${productId}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found')
        return res.json()
      })
      .then(data => {
        useStore.getState().setSelectedProduct({
          id: data._id || data.id,
          name: data.name,
          category: data.category,
          modelFilePath: data.modelFilePath,
          colorZones: data.colorZones,
        })
        setLoading(false)
      })
      .catch(() => {
        const fallback = FALLBACK_PRODUCTS.find(p => p._id === productId || p.id === productId)
        if (fallback) {
          useStore.getState().setSelectedProduct({
            id: fallback._id || fallback.id,
            name: fallback.name,
            category: fallback.category,
            modelFilePath: fallback.modelFilePath,
            colorZones: fallback.colorZones,
          })
          setLoading(false)
        } else {
          alert('Product template not found. Redirecting to selection.')
          navigate('/sports', { replace: true })
        }
      })
  }, [productId, navigate])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 text-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-sm font-semibold tracking-wide text-slate-500 uppercase">Loading Workspace...</p>
      </div>
    )
  }

  const handleSave = async () => {
    const snapshot = useStore.getState().getSnapshot()
    
    if (token) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/designs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            productId: snapshot.selectedProduct.id,
            name: snapshot.designName,
            colorZones: snapshot.colorZones,
            textConfig: snapshot.textConfig,
            logoUrl: snapshot.logoUrl,
            logoPlacement: snapshot.logoPlacement,
            patternId: snapshot.patternId
          })
        });

        if (res.ok) {
          const savedDesign = await res.json();
          alert('Design saved successfully to your account!');
          return savedDesign._id;
        } else {
          throw new Error('Failed to save to backend');
        }
      } catch (err) {
        console.error(err);
        localStorage.setItem('savedDesign', JSON.stringify(snapshot))
        alert('Could not save to server. Design saved locally as a fallback.');
        return null;
      }
    } else {
      localStorage.setItem('savedDesign', JSON.stringify(snapshot))
      alert('Design saved locally. Log in to save to your account.')
      return null;
    }
  }

  const handleQuote = () => setShowQuoteModal(true)

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">

      <BuilderHeader activeStep={TAB_STEP[activeTab] || 0} />

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-w-0">

        {/* LEFT SIDEBAR (DESKTOP ONLY) */}
        <aside className="hidden lg:flex w-72 flex-shrink-0 flex flex-col bg-white border-r border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <ProductSelector />
          </div>

          <div className="flex border-b border-gray-100 flex-shrink-0">
            {CONTROL_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-base leading-none">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'colors'  && <ColorPanel />}
            {activeTab === 'text'    && <TextPanel />}
            {activeTab === 'logo'    && <LogoPanel />}
            {activeTab === 'pattern' && <PatternPanel />}
          </div>
        </aside>

        {/* CENTER: 3D CANVAS */}
        <main className="flex-1 relative overflow-hidden min-w-0 h-[40vh] lg:h-full flex-shrink-0 lg:flex-shrink">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-gray-200 pointer-events-none" />
          <div className="relative w-full h-full">
            <ModelViewer />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full pointer-events-none select-none">
            Drag to rotate · Scroll to zoom
          </div>
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm border border-gray-200 text-xs px-3 py-1.5 rounded-full text-gray-600 pointer-events-none select-none">
            Viewing: <span className="font-medium text-gray-900">{selectedProduct?.name || '3D Model'}</span>
          </div>
        </main>

        {/* MOBILE CONTROL DRAWER */}
        <div className="lg:hidden flex-1 flex flex-col min-h-0 bg-white border-t border-gray-200 overflow-hidden">
          {activeMobileTab === 'product' && (
            <div className="flex-1 overflow-y-auto p-4">
              <ProductSelector />
            </div>
          )}
          
          {activeMobileTab === 'customize' && (
            <>
              <div className="flex border-b border-gray-100 flex-shrink-0 bg-gray-50/50">
                {CONTROL_TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 bg-blue-50'
                        : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-base leading-none">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'colors'  && <ColorPanel />}
                {activeTab === 'text'    && <TextPanel />}
                {activeTab === 'logo'    && <LogoPanel />}
                {activeTab === 'pattern' && <PatternPanel />}
              </div>
            </>
          )}

          {activeMobileTab === 'review' && (
            <div className="flex-1 overflow-y-auto p-4">
              <DesignSummary 
                onSave={handleSave} 
                onQuote={handleQuote} 
                onLoadDesign={() => setShowSavedModal(true)} 
              />
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR (DESKTOP ONLY) */}
        <aside className="hidden lg:flex w-64 flex-shrink-0 flex flex-col bg-white border-l border-gray-200 p-4 overflow-hidden">
          <DesignSummary 
            onSave={handleSave} 
            onQuote={handleQuote} 
            onLoadDesign={() => setShowSavedModal(true)} 
          />
        </aside>

      </div>

      {/* MOBILE TAB BAR */}
      <nav className="lg:hidden h-16 bg-white border-t border-gray-200 flex flex-shrink-0">
        <button
          onClick={() => setActiveMobileTab('product')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 text-[11px] transition-colors border-t-2 ${
            activeMobileTab === 'product' ? 'border-blue-500 text-blue-600 bg-blue-50/20 font-semibold' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <span className="text-lg">👕</span>
          <span>Product</span>
        </button>
        <button
          onClick={() => setActiveMobileTab('customize')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 text-[11px] transition-colors border-t-2 ${
            activeMobileTab === 'customize' ? 'border-blue-500 text-blue-600 bg-blue-50/20 font-semibold' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <span className="text-lg">🎨</span>
          <span>Customize</span>
        </button>
        <button
          onClick={() => setActiveMobileTab('review')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 text-[11px] transition-colors border-t-2 ${
            activeMobileTab === 'review' ? 'border-blue-500 text-blue-600 bg-blue-50/20 font-semibold' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <span className="text-lg">📋</span>
          <span>Review</span>
        </button>
      </nav>

      {/* QUOTE MODAL */}
      {showQuoteModal && (
        <QuoteModal 
          onClose={() => setShowQuoteModal(false)} 
          token={token} 
          handleSave={handleSave} 
        />
      )}

      {/* SAVED DESIGNS MODAL */}
      <SavedDesignsModal isOpen={showSavedModal} onClose={() => setShowSavedModal(false)} />

    </div>
  )
}
