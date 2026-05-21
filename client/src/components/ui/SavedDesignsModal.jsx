/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from 'react';
import useStore from '../../store/useStore';
import { API_BASE_URL } from '../../config';

export default function SavedDesignsModal({ isOpen, onClose }) {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = useStore(state => state.token);
  const loadDesignSnapshot = useStore(state => state.loadDesignSnapshot);

  const fetchDesigns = useCallback(async () => {
    Promise.resolve().then(() => {
      setLoading(true);
      setError('');
    });
    try {
      const res = await fetch(`${API_BASE_URL}/api/designs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch designs');
      const data = await res.json();
      setDesigns(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isOpen) {
      fetchDesigns();
    }
  }, [isOpen, fetchDesigns]);

  const handleLoad = (design) => {
    loadDesignSnapshot(design);
    onClose();
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this design?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/designs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete design');
      setDesigns(designs.filter(d => d._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Your Saved Designs</h2>
            <p className="text-sm text-gray-500 mt-1">Load a previous design to continue working</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500 bg-red-50 rounded-xl border border-red-100">
              {error}
            </div>
          ) : designs.length === 0 ? (
            <div className="text-center py-16 flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100 shadow-sm">
                <span className="text-2xl opacity-50">🎨</span>
              </div>
              <h3 className="text-gray-900 font-medium mb-1">No designs yet</h3>
              <p className="text-sm text-gray-500">Save a design and it will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {designs.map(design => (
                <div 
                  key={design._id}
                  onClick={() => handleLoad(design)}
                  className="group relative border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all bg-white"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900 truncate pr-8">{design.name || 'Untitled Design'}</h3>
                    <button 
                      onClick={(e) => handleDelete(e, design._id)}
                      className="absolute top-3 right-3 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      title="Delete design"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span>Last updated:</span>
                      <span className="font-medium text-gray-700">{new Date(design.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Primary color:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: design.colorZones?.body || '#fff' }}></span>
                        <span className="uppercase text-[10px]">{design.colorZones?.body || '#ffffff'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
