import { Link } from 'react-router-dom';
import { FaDog } from 'react-icons/fa';
import Button from '../components/ui/Button';
import { ROUTES } from '../config/constants';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <FaDog className="text-8xl text-bark-300 mx-auto mb-4" />
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-xl text-gray-500 mb-6">This page went for a walk and didn't come back.</p>
        <Link to={ROUTES.DASHBOARD}>
          <Button size="lg">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
