import LoginForm from '../components/auth/LoginForm';
import { FaDog } from 'react-icons/fa';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bark-50 to-paw-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <FaDog className="text-5xl text-bark-500 mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-gray-900">Bench Bark</h1>
          <p className="text-gray-500 mt-1">Your dog training companion</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
