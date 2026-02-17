import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { useDogs } from '../hooks/useDogs';
import DogCard from '../components/dogs/DogCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { ROUTES } from '../config/constants';

export default function DogsPage() {
  const { data: dogs, isLoading } = useDogs();

  if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Dogs</h1>
        <Link to={ROUTES.DOG_NEW}>
          <Button><FaPlus className="text-xs" /> Add Dog</Button>
        </Link>
      </div>

      {!dogs || dogs.length === 0 ? (
        <EmptyState
          title="No dogs yet"
          description="Add your first dog to get started!"
          action={
            <Link to={ROUTES.DOG_NEW}>
              <Button><FaPlus className="text-xs" /> Add Your First Dog</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dogs.map((dog) => (
            <DogCard key={dog.id} dog={dog} />
          ))}
        </div>
      )}
    </div>
  );
}
