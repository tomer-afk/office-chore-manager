import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useCreateDog } from '../hooks/useDogs';
import DogForm from '../components/dogs/DogForm';
import DogPhotoUpload from '../components/dogs/DogPhotoUpload';
import type { DogFormData } from '../components/dogs/DogForm';
import type { PhotoAnalysisResponse } from '../types/dog';
import { ROUTES } from '../config/constants';

export default function AddDogPage() {
  const navigate = useNavigate();
  const createMutation = useCreateDog();
  const [createdDogId, setCreatedDogId] = useState<number | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<{ breed?: string; estimated_age?: string }>({});

  const handleSubmit = (data: DogFormData) => {
    createMutation.mutate(
      { ...data, weight: data.weight === '' ? undefined : data.weight } as any,
      {
        onSuccess: (dog) => {
          setCreatedDogId(dog.id);
        },
      }
    );
  };

  const handleAnalysis = (analysis: PhotoAnalysisResponse['ai_analysis']) => {
    if (analysis) {
      setAiSuggestions({ breed: analysis.breed, estimated_age: analysis.estimated_age });
    }
  };

  if (createdDogId) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Upload a Photo</h1>
        <p className="text-gray-500 mb-4">Upload a photo for AI breed and age detection.</p>
        <DogPhotoUpload dogId={createdDogId} onAnalysis={handleAnalysis} />
        {aiSuggestions.breed && (
          <div className="mt-4 bg-paw-50 border border-paw-200 rounded-xl p-4">
            <p className="text-sm font-medium text-paw-700">AI Detected:</p>
            <p className="text-sm text-paw-600">Breed: {aiSuggestions.breed}</p>
            <p className="text-sm text-paw-600">Age: {aiSuggestions.estimated_age}</p>
          </div>
        )}
        <button
          onClick={() => navigate(`/dogs/${createdDogId}`)}
          className="mt-4 w-full bg-bark-500 hover:bg-bark-600 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          View Dog Profile
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link to={ROUTES.DOGS} className="inline-flex items-center gap-2 text-bark-600 hover:text-bark-700 mb-4">
        <FaArrowLeft /> Back to dogs
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add a Dog</h1>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <DogForm onSubmit={handleSubmit} isSubmitting={createMutation.isPending} submitLabel="Add Dog" />
      </div>
    </div>
  );
}
