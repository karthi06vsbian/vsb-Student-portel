import { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import { TEACHER_STUDENT_FIELDS } from '../../constants/studentFields';

const INITIAL_FORM = {
  register_no: '',
  password: '',
  dob: '',
};

function normalizePayload(form, sectionId) {
  const payload = { section_id: sectionId };

  for (const [key, value] of Object.entries(form)) {
    if (typeof value === 'boolean') {
      payload[key] = value;
      continue;
    }
    if (value !== '') {
      payload[key] = value;
    }
  }

  return payload;
}

function FieldInput({ field, value, onChange }) {
  if (field.type === 'checkbox') {
    return (
      <label className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(field.key, e.target.checked)}
          className="rounded border-slate-300"
        />
        <span>{field.label}</span>
      </label>
    );
  }

  if (field.type === 'select') {
    return (
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">{field.label}</label>
        <select
          value={value || ''}
          required={field.required}
          onChange={(e) => onChange(field.key, e.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
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
        required={field.required}
        onChange={(e) => onChange(field.key, e.target.value)}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />
    </div>
  );
}

export default function AddStudentForm({ sectionId, onStudentAdded }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      await axiosClient.post('/students', normalizePayload(form, sectionId));
      setForm(INITIAL_FORM);
      setMessage('Student login created successfully.');
      onStudentAdded?.();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add student');
    } finally {
      setSaving(false);
    }
  };

  const quickFields = [
    { key: 'register_no', label: 'Register No', required: true },
    { key: 'password', label: 'Login Password', type: 'password', required: true },
    { key: 'dob', label: 'DOB', type: 'date', required: true },
    { key: 'student_name', label: 'Student Name' },
    { key: 'roll_number', label: 'Roll Number' },
    { key: 'admission_no', label: 'Admission No' },
  ];
  const extraFields = TEACHER_STUDENT_FIELDS.filter(
    (field) => !quickFields.some((quick) => quick.key === field.key)
  );

  return (
    <section className="rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-800">Add Student Login</h3>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {expanded ? 'Hide Details' : 'Full Details'}
        </button>
      </div>

      {message && <p className="mb-3 rounded-md bg-green-50 p-3 text-sm text-green-700">{message}</p>}
      {error && <p className="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickFields.map((field) => (
            <FieldInput
              key={field.key}
              field={field}
              value={form[field.key]}
              onChange={updateField}
            />
          ))}
        </div>

        {expanded && (
          <div className="grid gap-4 border-t border-slate-200 pt-4 sm:grid-cols-2 lg:grid-cols-3">
            {extraFields.map((field) => (
              <FieldInput
                key={field.key}
                field={field}
                value={form[field.key]}
                onChange={updateField}
              />
            ))}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Adding...' : 'Add Student'}
          </button>
        </div>
      </form>
    </section>
  );
}
