import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/common/Navbar';
import DepartmentSelector from '../components/teacher/DepartmentSelector';
import BatchSelector from '../components/teacher/BatchSelector';
import SectionSelector from '../components/teacher/SectionSelector';
import StudentTable from '../components/teacher/StudentTable';
import AddStudentForm from '../components/teacher/AddStudentForm';
import ExcelDownloadButton from '../components/teacher/ExcelDownloadButton';
import axiosClient from '../api/axiosClient';
import Loader from '../components/common/Loader';

export default function TeacherDashboardPage() {
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [departmentId, setDepartmentId] = useState(null);
  const [batchId, setBatchId] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDepartments = useCallback(async () => {
    const { data } = await axiosClient.get('/departments');
    setDepartments(data);
  }, []);

  const loadBatches = useCallback(async (deptId) => {
    if (!deptId) { setBatches([]); return; }
    const { data } = await axiosClient.get(`/batches?departmentId=${deptId}`);
    setBatches(data);
  }, []);

  const loadSections = useCallback(async (bId) => {
    if (!bId) { setSections([]); return; }
    const { data } = await axiosClient.get(`/sections?batchId=${bId}`);
    setSections(data);
  }, []);

  const loadStudents = useCallback(async (secId) => {
    if (!secId) { setStudents([]); return; }
    const { data } = await axiosClient.get(`/students?sectionId=${secId}`);
    setStudents(data);
  }, []);

  useEffect(() => {
    loadDepartments().finally(() => setLoading(false));
  }, [loadDepartments]);

  useEffect(() => {
    loadBatches(departmentId);
    setBatchId(null);
    setSectionId(null);
  }, [departmentId, loadBatches]);

  useEffect(() => {
    loadSections(batchId);
    setSectionId(null);
  }, [batchId, loadSections]);

  useEffect(() => {
    loadStudents(sectionId);
  }, [sectionId, loadStudents]);

  const handleDepartmentSelect = (id) => {
    setDepartmentId(id);
  };

  const handleBatchSelect = (id) => {
    setBatchId(id);
  };

  const handleSectionSelect = (id) => {
    setSectionId(id);
  };

  if (loading) return <><Navbar /><Loader /></>;

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800">Teacher Dashboard</h1>
          {sectionId && <ExcelDownloadButton sectionId={sectionId} />}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <DepartmentSelector
            departments={departments}
            selectedId={departmentId}
            onSelect={handleDepartmentSelect}
            onRefresh={loadDepartments}
          />
          <BatchSelector
            departmentId={departmentId}
            batches={batches}
            selectedId={batchId}
            onSelect={handleBatchSelect}
            onRefresh={() => loadBatches(departmentId)}
          />
          <SectionSelector
            batchId={batchId}
            sections={sections}
            selectedId={sectionId}
            onSelect={handleSectionSelect}
            onRefresh={() => loadSections(batchId)}
          />
        </div>

        {sectionId && (
          <div className="space-y-6">
            <AddStudentForm sectionId={sectionId} onStudentAdded={() => loadStudents(sectionId)} />
            <StudentTable sectionId={sectionId} students={students} onRefresh={() => loadStudents(sectionId)} />
          </div>
        )}
      </main>
    </div>
  );
}
