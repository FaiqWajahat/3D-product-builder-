import useStore from '../../store/useStore'
import { useNavigate } from 'react-router-dom'

const STEPS = ['Product', 'Colors', 'Text', 'Logo', 'Pattern', 'Review']

export default function BuilderHeader({ activeStep = 0 }) {
  const selectedProduct = useStore(state => state.selectedProduct)
  const setSelectedProduct = useStore(state => state.setSelectedProduct)
  const user = useStore(state => state.user)
  const logout = useStore(state => state.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleBackToWizard = () => {
    if (window.confirm('Do you want to go back to product selection? Your current unsaved customizations will be reset.')) {
      setSelectedProduct(null)
      localStorage.removeItem('savedDesign')
      navigate('/sports')
    }
  }

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-gray-200 bg-white flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={handleBackToWizard}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-blue-600 transition-colors bg-gray-100 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-blue-200"
          title="Go back to sports and template selection"
        >
          <span>←</span> Choose Product
        </button>
        {selectedProduct?.name && (
          <>
            <span className="text-gray-300">/</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 uppercase tracking-wide">
              {selectedProduct.category}
            </span>
            <span className="text-sm font-medium text-gray-500">{selectedProduct.name}</span>
          </>
        )}
      </div>

      <div className="hidden md:flex items-center gap-1">
        {STEPS.map((step, i) => (
          <div key={step} className="flex items-center gap-1">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-colors ${
              i === activeStep ? 'bg-blue-50 text-blue-700 font-medium' : i < activeStep ? 'text-gray-400' : 'text-gray-300'
            }`}>
              <span className={`w-4 h-4 rounded-full text-xs flex items-center justify-center ${
                i === activeStep ? 'bg-blue-600 text-white' : i < activeStep ? 'bg-gray-300 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {i < activeStep ? '✓' : i + 1}
              </span>
              {step}
            </div>
            {i < STEPS.length - 1 && <span className="text-gray-200 text-xs">›</span>}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 text-xs">
        <span className="hidden lg:block text-gray-400">
          Drag to rotate · Scroll to zoom
        </span>
        
        {user && (
          <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
            <span className="font-medium text-gray-700">{user.name}</span>
            <button 
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
