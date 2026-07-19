import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="mb-4 text-4xl font-bold text-slate-800">
          College Student Information Portal
        </h1>
        <p className="mb-8 text-lg text-slate-600">
          Collect and manage student information securely. Teachers can manage departments,
          batches, sections, and bulk import students. Students can fill in their profile details.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/student/login"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            Student Login
          </Link>
          <Link
            to="/teacher/login"
            className="rounded-lg border border-blue-600 px-6 py-3 font-medium text-blue-600 hover:bg-blue-50"
          >
            Teacher Login
          </Link>
        </div>
      </main>
    </div>
  );
}
