import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../../store/useStore'
import { API_BASE_URL } from '../../config'
import { FALLBACK_PRODUCTS } from '../../data/fallbackProducts'

const getCategories = (products) =>
  ['all', ...new Set(products.map(p => p.category))]

export default function ProductSelector() {
  const navigate = useNavigate()
  const [products, setProducts] = useState(FALLBACK_PRODUCTS)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const selectedProduct = useStore(state => state.selectedProduct)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => { if (!res.ok) throw new Error('API not ready'); return res.json() })
      .then(data => {
        const list = data.length > 0 ? data : FALLBACK_PRODUCTS
        setProducts(list)
      })
      .catch(() => {
        setProducts(FALLBACK_PRODUCTS)
      })
      .finally(() => setLoading(false))
  }, [])

  const categories = getCategories(products)
  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory)

  const handleSelect = (product) => {
    navigate(`/builder/${product._id || product.id}`)
  }

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</h3>

      <div className="flex gap-1 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-2.5 py-1 text-xs rounded-md border capitalize transition-colors ${
              activeCategory === cat
                ? 'bg-gray-900 text-white border-gray-900'
                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
          {filtered.map(product => {
            const isSelected = selectedProduct?.id === (product._id || product.id)
            return (
              <button
                key={product._id || product.id}
                onClick={() => handleSelect(product)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2.5 border transition-colors ${
                  isSelected
                    ? 'bg-blue-50 border-blue-200 text-blue-800'
                    : 'border-transparent hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isSelected ? 'bg-blue-500' : 'bg-gray-300'}`} />
                <div className="flex flex-col leading-tight">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-xs text-gray-400 capitalize">{product.colorZones?.join(' · ')}</span>
                </div>
                {isSelected && <span className="ml-auto text-blue-500 text-xs">✓</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

