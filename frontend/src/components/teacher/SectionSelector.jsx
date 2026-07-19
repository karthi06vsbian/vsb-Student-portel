import { useState } from 'react';
import axiosClient from '../../api/axiosClient';

export default function SectionSelector({ batchId, sections, selectedId, onSelect, onRefresh }) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!batchId) return null;

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axiosClient.post('/sections', {
        batch_id: batchId,
        name,
      });
      onSelect(data.id);
      setShowAdd(false);
      setName('');
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add section');
    }
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <label className="mb-2 block text-sm font-semibold text-slate-700">Section</label>
      <div className="flex gap-2">
        <select
          value={selectedId || ''}
          onChange={(e) => onSelect(e.target.value ? parseInt(e.target.value, 10) : null)}
          className="flex-1 rounded-md border border-slate-300 px-3 py-2"
        >
          <option value="">Select Section</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>Section {s.name}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className="rounded-md bg-slate-100 px-3 py-2 text-sm font-medium hover:bg-slate-200"
        >
          + Add
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="mt-3 space-y-2 border-t pt-3">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <input
            type="text"
            placeholder="Section (A, B, C...)"
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())}
            maxLength={1}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm uppercase"
          />
          <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
            Save Section
          </button>
        </form>
      )}
    </div>
  );
}
