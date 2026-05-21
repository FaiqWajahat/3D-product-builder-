import { useEffect, useState } from 'react'
import useStore from '../../store/useStore'
import { API_BASE_URL } from '../../config'

const FALLBACK_PRODUCTS = [
  {
    _id: '64a7f1b2c3d4e5f6a7b8c9d0',
    name: 'Baseball Jersey',
    category: 'jersey',
    modelFilePath: '/models/jersey.glb',
    colorZones: ['body', 'sleeves', 'collar'],
  },
  {
    _id: '64a7f1b2c3d4e5f6a7b8c9d1',
    name: 'Baseball Cap',
    category: 'cap',
    modelFilePath: '/models/cap.glb',
    colorZones: ['body', 'brim', 'button'],
  },
  {
    _id: '64a7f1b2c3d4e5f6a7b8c9d2',
    name: 'T-Shirt',
    category: 't-shirt',
    modelFilePath: '/models/t-shirt.glb',
    colorZones: ['body', 'piping', 'waistband'],
  },
]

const getCategories = (products) =>
  ['all', ...new Set(products.map(p => p.category))]

export default function ProductSelector() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS)
  const [loading, setLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const selectedProduct = useStore(state => state.selectedProduct)
  const setSelectedProduct = useStore(state => state.setSelectedProduct)

  useEffect(() => {
    setLoading(true)
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => { if (!res.ok) throw new Error('API not ready'); return res.json() })
      .then(data => {
        const list = data.length > 0 ? data : FALLBACK_PRODUCTS
        setProducts(list)
        
        const hasSaved = localStorage.getItem('savedDesign')
        if (!hasSaved && list.length > 0) {
          const first = list[0]
          setSelectedProduct({
            id: first._id,
            name: first.name,
            category: first.category,
            modelFilePath: first.modelFilePath,
            colorZones: first.colorZones,
          })
        }
      })
      .catch(() => {
        setProducts(FALLBACK_PRODUCTS)
        const hasSaved = localStorage.getItem('savedDesign')
        if (!hasSaved && FALLBACK_PRODUCTS.length > 0) {
          const first = FALLBACK_PRODUCTS[0]
          setSelectedProduct({
            id: first._id,
            name: first.name,
            category: first.category,
            modelFilePath: first.modelFilePath,
            colorZones: first.colorZones,
          })
        }
      })
      .finally(() => setLoading(false))
  }, [setSelectedProduct])

  const categories = getCategories(products)
  const filtered = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory)

  const handleSelect = (product) => {
    setSelectedProduct({
      id: product._id,
      name: product.name,
      category: product.category,
      modelFilePath: product.modelFilePath,
      colorZones: product.colorZones,
    })
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
        <div className="flex flex-col gap-1.5">
          {filtered.map(product => {
            const isSelected = selectedProduct?.id === product._id
            return (
              <button
                key={product._id}
                onClick={() => handleSelect(product)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-2.5 border transition-colors ${
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
