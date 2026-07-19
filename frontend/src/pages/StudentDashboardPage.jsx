import Navbar from '../components/common/Navbar';
import StudentDetailsForm from '../components/student/StudentDetailsForm';

export default function StudentDashboardPage() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-slate-800">My Profile</h1>
        <StudentDetailsForm />
      </main>
    </div>
  );
}
