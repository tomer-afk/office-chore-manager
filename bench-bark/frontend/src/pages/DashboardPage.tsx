import { Link } from 'react-router-dom';
import { FaDog, FaBook, FaPlus } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import { useDogs } from '../hooks/useDogs';
import { useProgress } from '../hooks/useProgress';
import ProgressBar from '../components/lessons/ProgressBar';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ROUTES } from '../config/constants';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data: dogs, isLoading: dogsLoading } = useDogs();
  const { data: progress, isLoading: progressLoading } = useProgress();

  if (dogsLoading || progressLoading) return <LoadingSpinner size="lg" className="py-20" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-500">Here's your training overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-bark-100 rounded-xl flex items-center justify-center">
              <FaDog className="text-bark-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{dogs?.length || 0}</p>
              <p className="text-sm text-gray-500">Dog{dogs?.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-paw-100 rounded-xl flex items-center justify-center">
              <FaBook className="text-paw-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{progress?.read || 0}</p>
              <p className="text-sm text-gray-500">Lessons completed</p>
            </div>
          </div>
        </Card>

        <Card>
          {progress && <ProgressBar percentage={progress.percentage} read={progress.read} total={progress.total} />}
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to={ROUTES.DOG_NEW}
          className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-bark-100 rounded-xl flex items-center justify-center">
            <FaPlus className="text-bark-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Add a Dog</h3>
            <p className="text-sm text-gray-500">Register a new dog profile</p>
          </div>
        </Link>

        <Link
          to={ROUTES.LESSONS}
          className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-paw-100 rounded-xl flex items-center justify-center">
            <FaBook className="text-paw-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Browse Training</h3>
            <p className="text-sm text-gray-500">Explore training categories</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
