import { format } from 'date-fns';
import { FaDog, FaWeight, FaBirthdayCake, FaVenusMars, FaNotesMedical } from 'react-icons/fa';
import type { Dog } from '../../types/dog';

interface DogProfileProps {
  dog: Dog;
}

export default function DogProfile({ dog }: DogProfileProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
      <div className="aspect-video bg-gray-100 flex items-center justify-center">
        {dog.photo_url ? (
          <img src={dog.photo_url} alt={dog.name} className="w-full h-full object-cover" />
        ) : (
          <FaDog className="text-8xl text-gray-300" />
        )}
      </div>
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">{dog.name}</h2>

        <div className="grid grid-cols-2 gap-4">
          {dog.breed && (
            <div className="flex items-center gap-2 text-gray-600">
              <FaDog className="text-bark-500" />
              <div>
                <p className="text-xs text-gray-400">Breed</p>
                <p className="text-sm font-medium">{dog.breed}</p>
                {dog.ai_breed_confidence && (
                  <p className="text-xs text-paw-500">{dog.ai_breed_confidence}% AI confidence</p>
                )}
              </div>
            </div>
          )}
          {dog.estimated_age && (
            <div className="flex items-center gap-2 text-gray-600">
              <FaBirthdayCake className="text-bark-500" />
              <div>
                <p className="text-xs text-gray-400">Age</p>
                <p className="text-sm font-medium">{dog.estimated_age}</p>
              </div>
            </div>
          )}
          {dog.weight && (
            <div className="flex items-center gap-2 text-gray-600">
              <FaWeight className="text-bark-500" />
              <div>
                <p className="text-xs text-gray-400">Weight</p>
                <p className="text-sm font-medium">{dog.weight} {dog.weight_unit}</p>
              </div>
            </div>
          )}
          {dog.gender && (
            <div className="flex items-center gap-2 text-gray-600">
              <FaVenusMars className="text-bark-500" />
              <div>
                <p className="text-xs text-gray-400">Gender</p>
                <p className="text-sm font-medium capitalize">{dog.gender}</p>
              </div>
            </div>
          )}
        </div>

        {dog.special_needs && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Special Needs</h3>
            <p className="text-sm text-gray-600">{dog.special_needs}</p>
          </div>
        )}

        {dog.medical_notes && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Medical Notes</h3>
            <p className="text-sm text-gray-600">{dog.medical_notes}</p>
          </div>
        )}

        {dog.vaccination_records && dog.vaccination_records.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <FaNotesMedical className="text-bark-500" /> Vaccinations
            </h3>
            <div className="space-y-1">
              {dog.vaccination_records.map((v, i) => (
                <div key={i} className="flex items-center justify-between text-sm bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="font-medium">{v.name}</span>
                  <span className="text-gray-500">{format(new Date(v.date), 'MMM d, yyyy')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400">Added {format(new Date(dog.created_at), 'MMMM d, yyyy')}</p>
      </div>
    </div>
  );
}
