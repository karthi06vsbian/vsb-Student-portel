import { useState } from 'react';
import axiosClient from '../../api/axiosClient';

export default function StudentTable({ sectionId, students, onRefresh }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState('');

  if (!sectionId) return null;

  const startEdit = (student) => {
    setEditing(student.id);
    setForm({ ...student });
    setError('');
  };

  const handleSave = async () => {
    try {
      await axiosClient.put(`/students/${editing}`, form);
      setEditing(null);
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update student');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await axiosClient.delete(`/students/${id}`);
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete student');
    }
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Students ({students.length})</h3>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {students.length === 0 ? (
        <p className="text-sm text-slate-500">No students in this section. Add a student login above.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="px-3 py-2">Register No</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Roll No</th>
                <th className="px-3 py-2">New Password</th>
                <th className="px-3 py-2">Profile</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b">
                  {editing === s.id ? (
                    <>
                      <td className="px-3 py-2">
                        <input
                          value={form.register_no || ''}
                          disabled
                          className="w-28 rounded border px-2 py-1 text-xs bg-slate-50"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          value={form.student_name || ''}
                          onChange={(e) => updateField('student_name', e.target.value)}
                          className="w-40 rounded border px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          value={form.roll_number || ''}
                          onChange={(e) => updateField('roll_number', e.target.value)}
                          className="w-24 rounded border px-2 py-1 text-xs"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="password"
                          value={form.password || ''}
                          onChange={(e) => updateField('password', e.target.value)}
                          className="w-32 rounded border px-2 py-1 text-xs"
                          placeholder="Optional"
                        />
                      </td>
                      <td className="px-3 py-2">
                        {s.profile_completed ? 'Complete' : 'Pending'}
                      </td>
                      <td className="px-3 py-2 space-x-2">
                        <button onClick={handleSave} className="text-blue-600 hover:underline">Save</button>
                        <button onClick={() => setEditing(null)} className="text-slate-500 hover:underline">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 py-2">{s.register_no}</td>
                      <td className="px-3 py-2">{s.student_name || '—'}</td>
                      <td className="px-3 py-2">{s.roll_number || '—'}</td>
                      <td className="px-3 py-2 text-slate-400">—</td>
                      <td className="px-3 py-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs ${s.profile_completed ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {s.profile_completed ? 'Complete' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-3 py-2 space-x-2">
                        <button onClick={() => startEdit(s)} className="text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:underline">Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
