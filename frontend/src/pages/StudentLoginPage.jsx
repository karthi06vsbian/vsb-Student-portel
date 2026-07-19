import Navbar from '../components/common/Navbar';
import StudentLoginForm from '../components/student/StudentLoginForm';

export default function StudentLoginPage() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <StudentLoginForm />
      </main>
    </div>
  );
}
