import { useState } from 'react';
import axiosClient from '../../api/axiosClient';

export default function BatchSelector({ departmentId, batches, selectedId, onSelect, onRefresh }) {
  const [showAdd, setShowAdd] = useState(false);
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [error, setError] = useState('');

  if (!departmentId) return null;

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await axiosClient.post('/batches', {
        department_id: departmentId,
        start_year: parseInt(startYear, 10),
        end_year: parseInt(endYear, 10),
      });
      onSelect(data.id);
      setShowAdd(false);
      setStartYear('');
      setEndYear('');
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add batch');
    }
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <label className="mb-2 block text-sm font-semibold text-slate-700">Batch</label>
      <div className="flex gap-2">
        <select
          value={selectedId || ''}
          onChange={(e) => onSelect(e.target.value ? parseInt(e.target.value, 10) : null)}
          className="flex-1 rounded-md border border-slate-300 px-3 py-2"
        >
          <option value="">Select Batch</option>
          {batches.map((b) => (
            <option key={b.id} value={b.id}>{b.start_year}–{b.end_year}</option>
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
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Start Year"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="End Year"
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
            Save Batch
          </button>
        </form>
      )}
    </div>
  );
}
