import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import Loader from '../common/Loader';
import { INSTITUTIONAL_FIELDS, STUDENT_DETAIL_SECTIONS } from '../../constants/studentFields';

function FieldInput({ field, value, onChange }) {
  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(field.key, e.target.checked)}
          className="rounded border-slate-300"
        />
        <span className="text-sm">{field.label}</span>
      </label>
    );
  }

  if (field.type === 'select') {
    return (
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">{field.label}</label>
        <select
          value={value || ''}
          onChange={(e) => onChange(field.key, e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">Select</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{field.label}</label>
      <input
        type={field.type || 'text'}
        value={value || ''}
        onChange={(e) => onChange(field.key, e.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />
    </div>
  );
}

export default function StudentDetailsForm() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axiosClient.get('/students/me')
      .then(({ data }) => setProfile(data))
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const updateField = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const { data } = await axiosClient.put('/students/me', profile);
      setProfile(data);
      setMessage('Profile saved successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading your profile..." />;
  if (!profile) return <p className="text-red-600">{error || 'Profile not found'}</p>;

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {message && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">{message}</div>
      )}
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">Institutional Details (Read Only)</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INSTITUTIONAL_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="mb-1 block text-xs font-medium uppercase text-slate-500">{field.label}</label>
              <input
                type="text"
                value={profile[field.key] || '—'}
                readOnly
                className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
              />
            </div>
          ))}
        </div>
      </section>

      {STUDENT_DETAIL_SECTIONS.map((section) => (
        <section key={section.title} className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">{section.title}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {section.fields.map((field) => (
              <FieldInput
                key={field.key}
                field={field}
                value={profile[field.key]}
                onChange={updateField}
              />
            ))}
          </div>
        </section>
      ))}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-blue-600 px-8 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
}
