import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useDog, useUpdateDog } from '../hooks/useDogs';
import DogForm from '../components/dogs/DogForm';
import type { DogFormData } from '../components/dogs/DogForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function EditDogPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: dog, isLoading } = useDog(Number(id));
  const updateMutation = useUpdateDog();

  if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;
  if (!dog) return <p className="text-center text-gray-500 py-20">Dog not found.</p>;

  const handleSubmit = (data: DogFormData) => {
    updateMutation.mutate(
      { id: dog.id, data: { ...data, weight: data.weight === '' ? undefined : data.weight } as any },
      { onSuccess: () => navigate(`/dogs/${dog.id}`) }
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link to={`/dogs/${dog.id}`} className="inline-flex items-center gap-2 text-bark-600 hover:text-bark-700 mb-4">
        <FaArrowLeft /> Back to {dog.name}
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit {dog.name}</h1>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <DogForm
          defaultValues={{
            name: dog.name,
            breed: dog.breed || '',
            estimated_age: dog.estimated_age || '',
            weight: dog.weight ?? ('' as any),
            weight_unit: dog.weight_unit,
            gender: dog.gender || undefined,
            special_needs: dog.special_needs || '',
            medical_notes: dog.medical_notes || '',
            vaccination_records: dog.vaccination_records || [],
          }}
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
          submitLabel="Save Changes"
          dog={dog}
        />
      </div>
    </div>
  );
}
