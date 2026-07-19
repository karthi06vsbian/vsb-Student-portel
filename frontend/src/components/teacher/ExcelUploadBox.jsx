import { useState } from 'react';
import axiosClient from '../../api/axiosClient';

export default function ExcelUploadBox({ sectionId, onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  if (!sectionId) return null;

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await axiosClient.post(`/excel/upload?sectionId=${sectionId}`, formData);

      setResult(data);
      setFile(null);
      onUploadComplete?.();
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold">Upload Excel</h3>
      <p className="mb-3 text-sm text-slate-500">
        Upload Excel with at least RegisterNo and Password columns. Optional locked fields are supported.
      </p>

      <form onSubmit={handleUpload} className="space-y-3">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full text-sm"
        />
        <button
          type="submit"
          disabled={!file || loading}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Upload Students'}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-3 rounded-md bg-green-50 p-3 text-sm text-green-800">
          <p className="font-medium">{result.message}</p>
          {result.errors?.length > 0 && (
            <ul className="mt-2 list-inside list-disc text-xs">
              {result.errors.slice(0, 5).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
              {result.errors.length > 5 && <li>...and {result.errors.length - 5} more</li>}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
