import { Link } from 'react-router-dom';
import { FaDog } from 'react-icons/fa';
import type { Dog } from '../../types/dog';

interface DogCardProps {
  dog: Dog;
}

export default function DogCard({ dog }: DogCardProps) {
  return (
    <Link
      to={`/dogs/${dog.id}`}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center">
        {dog.photo_url ? (
          <img src={dog.photo_url} alt={dog.name} className="w-full h-full object-cover" />
        ) : (
          <FaDog className="text-6xl text-gray-300" />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{dog.name}</h3>
        {dog.breed && <p className="text-sm text-gray-500">{dog.breed}</p>}
        {dog.estimated_age && <p className="text-sm text-gray-400">{dog.estimated_age}</p>}
      </div>
    </Link>
  );
}
