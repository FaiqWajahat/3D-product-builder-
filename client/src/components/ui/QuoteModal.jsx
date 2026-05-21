import { useState } from 'react';
import useStore from '../../store/useStore';
import { API_BASE_URL } from '../../config';

export default function QuoteModal({ onClose, token, handleSave }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('You must be logged in to submit a quote.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // We need a designId to link to the order. 
      // The easiest way is to call handleSave() which creates the design in the backend.
      const savedDesignId = await handleSave();
      
      if (!savedDesignId) {
        throw new Error('Failed to save design before submitting quote.');
      }

      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          designId: savedDesignId,
          userDetails: { name, email, phone, qty, notes }
        })
      });

      if (!res.ok) throw new Error('Failed to submit quote');

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Submit quote</h2>
        <p className="text-sm text-gray-400 mb-4">Fill out your details and we will get back to you with pricing.</p>
        
        {error && <div className="text-red-500 text-sm mb-3">{error}</div>}

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-3xl mb-4">
              ✓
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Quote Submitted!</h3>
            <p className="text-sm text-gray-500">We have received your design and will be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input 
              type="text" 
              placeholder="Your name" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" 
            />
            <input 
              type="email" 
              placeholder="Email address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" 
            />
            <input 
              type="tel" 
              placeholder="Phone number (optional)" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" 
            />
            <input 
              type="number" 
              placeholder="Quantity" 
              min={1} 
              required
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" 
            />
            <textarea
              placeholder="Additional notes or instructions (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
            />
            
            <div className="flex gap-2 mt-5">
              <button type="button" onClick={onClose} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-70">
                {loading ? 'Submitting...' : 'Submit →'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
