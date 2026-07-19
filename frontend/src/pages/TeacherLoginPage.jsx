import Navbar from '../components/common/Navbar';
import TeacherLoginForm from '../components/teacher/TeacherLoginForm';

export default function TeacherLoginPage() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <TeacherLoginForm />
      </main>
    </div>
  );
}
