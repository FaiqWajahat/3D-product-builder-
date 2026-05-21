import { useState, useEffect } from 'react'
import useStore from '../store/useStore'
import { API_BASE_URL } from '../config'
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
  const [activeTab, setActiveTab] = useState('colors')
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [showSavedModal, setShowSavedModal] = useState(false)
  const selectedProduct = useStore(state => state.selectedProduct)
  const token = useStore(state => state.token)

  useEffect(() => {
    const saved = localStorage.getItem('savedDesign')
    if (saved) {
      try {
        const snapshot = JSON.parse(saved)
        useStore.getState().loadDesignSnapshot(snapshot)
      } catch (err) {
        console.error('Failed to parse saved design:', err)
      }
    }
  }, [])

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

      <div className="flex flex-1 overflow-hidden min-w-0">

        {/* LEFT SIDEBAR */}
        <aside className="w-72 flex-shrink-0 flex flex-col bg-white border-r border-gray-200 overflow-hidden">
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
        <main className="flex-1 relative overflow-hidden min-w-0">
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

        {/* RIGHT SIDEBAR */}
        <aside className="w-64 flex-shrink-0 flex flex-col bg-white border-l border-gray-200 p-4 overflow-hidden">
          <DesignSummary 
            onSave={handleSave} 
            onQuote={handleQuote} 
            onLoadDesign={() => setShowSavedModal(true)} 
          />
        </aside>

      </div>

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
