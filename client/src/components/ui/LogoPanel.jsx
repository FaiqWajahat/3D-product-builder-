import { useRef, useState } from 'react'
import useStore from '../../store/useStore'
import { API_BASE_URL } from '../../config'

const PLACEMENTS = ['chest', 'back', 'sleeve']
const MAX_BYTES = 2 * 1024 * 1024

export default function LogoPanel() {
  const logoUrl = useStore(state => state.logoUrl)
  const logoPlacement = useStore(state => state.logoPlacement)
  const setLogoUrl = useStore(state => state.setLogoUrl)
  const setLogoPlacement = useStore(state => state.setLogoPlacement)
  const fileInputRef = useRef(null)

  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      alert('Only PNG and JPG files are accepted.')
      e.target.value = ''
      return
    }
    if (file.size > MAX_BYTES) {
      alert(`File too large. Max 2MB. Yours: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
      e.target.value = ''
      return
    }
    
    setIsUploading(true)
    const formData = new FormData()
    formData.append('logo', file)

    try {
      const res = await fetch(`${API_BASE_URL}/api/uploads`, {
        method: 'POST',
        body: formData,
      })
      
      if (!res.ok) throw new Error('Failed to upload image')
      
      const data = await res.json()
      setLogoUrl(data.url)
    } catch (err) {
      console.error(err)
      alert('Upload failed. Please check your backend and Cloudinary config.')
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Logo</h3>

      {!logoUrl ? (
        <div
          className={`border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center gap-2 transition-colors ${
            isUploading ? 'bg-gray-50 opacity-70 cursor-wait' : 'cursor-pointer hover:border-blue-300 hover:bg-blue-50'
          }`}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-xl">
            {isUploading ? <span className="animate-spin text-sm">↻</span> : '↑'}
          </div>
          <p className="text-sm text-gray-600 text-center">
            {isUploading ? 'Uploading to Cloudinary...' : 'Click to upload logo'}
          </p>
          <p className="text-xs text-gray-400">PNG or JPG · Max 2MB</p>
          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg" onChange={handleFileChange} className="hidden" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="relative w-full aspect-square max-h-32 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
            <img src={logoUrl} alt="logo preview" className="max-w-full max-h-full object-contain p-2" />
            <button
              onClick={() => { setLogoUrl(''); if (fileInputRef.current) fileInputRef.current.value = '' }}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
            >✕</button>
          </div>
          <button onClick={() => fileInputRef.current?.click()} className="text-xs text-blue-600 hover:text-blue-800 text-center">
            Replace image
          </button>
          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg" onChange={handleFileChange} className="hidden" />
        </div>
      )}

      {logoUrl && (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Logo placement</label>
          <div className="flex gap-2">
            {PLACEMENTS.map(p => (
              <button
                key={p}
                onClick={() => setLogoPlacement(p)}
                className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                  logoPlacement === p
                    ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
