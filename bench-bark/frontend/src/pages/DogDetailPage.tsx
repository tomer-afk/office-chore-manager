import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useDog, useDeleteDog } from '../hooks/useDogs';
import DogProfile from '../components/dogs/DogProfile';
import DogPhotoUpload from '../components/dogs/DogPhotoUpload';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import { ROUTES } from '../config/constants';

export default function DogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: dog, isLoading } = useDog(Number(id));
  const deleteMutation = useDeleteDog();
  const [showDelete, setShowDelete] = useState(false);

  if (isLoading) return <LoadingSpinner size="lg" className="py-20" />;
  if (!dog) return <p className="text-center text-gray-500 py-20">Dog not found.</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <Link to={ROUTES.DOGS} className="inline-flex items-center gap-2 text-bark-600 hover:text-bark-700 mb-4">
        <FaArrowLeft /> Back to dogs
      </Link>

      <div className="flex gap-2 mb-4">
        <Link to={`/dogs/${dog.id}/edit`}>
          <Button variant="secondary" size="sm"><FaEdit /> Edit</Button>
        </Link>
        <Button variant="danger" size="sm" onClick={() => setShowDelete(true)}><FaTrash /> Delete</Button>
      </div>

      <DogProfile dog={dog} />

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Photo</h3>
        <DogPhotoUpload dogId={dog.id} currentPhotoUrl={dog.photo_url} />
      </div>

      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => deleteMutation.mutate(dog.id, { onSuccess: () => navigate(ROUTES.DOGS) })}
        title="Delete Dog"
        message={`Are you sure you want to remove ${dog.name}? This cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
