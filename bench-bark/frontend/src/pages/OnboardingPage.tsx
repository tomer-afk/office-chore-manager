import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDog, FaCloudUploadAlt, FaSpinner } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import { useAnalyzePhoto, useCreateDog } from '../hooks/useDogs';
import DogForm from '../components/dogs/DogForm';
import type { DogFormData } from '../components/dogs/DogForm';
import type { AnalyzePhotoResponse } from '../types/dog';
import { ROUTES } from '../config/constants';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const analyzeMutation = useAnalyzePhoto();
  const createDogMutation = useCreateDog();

  const [step, setStep] = useState<1 | 2>(1);
  const [photoData, setPhotoData] = useState<{
    photo_url: string;
    photo_public_id: string;
  } | null>(null);
  const [aiDefaults, setAiDefaults] = useState<Partial<DogFormData>>({});
  const [aiConfidence, setAiConfidence] = useState<{
    ai_breed_confidence?: number;
    ai_age_confidence?: number;
    ai_raw_response?: Record<string, any>;
  }>({});
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      setPreview(URL.createObjectURL(file));
      analyzeMutation.mutate(file, {
        onSuccess: (data: AnalyzePhotoResponse) => {
          setPhotoData({ photo_url: data.photo_url, photo_public_id: data.photo_public_id });
          if (data.ai_analysis) {
            setAiDefaults({
              breed: data.ai_analysis.breed,
              estimated_age: data.ai_analysis.estimated_age,
            });
            setAiConfidence({
              ai_breed_confidence: data.ai_analysis.breed_confidence,
              ai_age_confidence: data.ai_analysis.age_confidence,
              ai_raw_response: data.ai_analysis as unknown as Record<string, any>,
            });
          }
          setStep(2);
        },
      });
    },
    [analyzeMutation]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) handleFile(file);
    },
    [handleFile]
  );

  const handleSubmit = (data: DogFormData) => {
    const payload = {
      ...data,
      weight: data.weight === '' ? undefined : data.weight,
      ...(photoData || {}),
      ...aiConfidence,
    };
    createDogMutation.mutate(payload, {
      onSuccess: () => {
        navigate(ROUTES.DASHBOARD);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bark-50 to-paw-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <FaDog className="text-5xl text-bark-500 mx-auto mb-2" />
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-gray-500 mt-1">Let's add your first dog</p>
        </div>

        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
              Upload a photo of your dog
            </h2>
            <p className="text-sm text-gray-500 mb-6 text-center">
              Our AI will detect the breed and estimate age automatically
            </p>

            <div
              className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-colors ${
                dragActive ? 'border-bark-500 bg-bark-50' : 'border-gray-300'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={onDrop}
            >
              {analyzeMutation.isPending ? (
                <div className="flex flex-col items-center gap-3 text-bark-600">
                  {preview && (
                    <img
                      src={preview}
                      alt="Dog photo"
                      className="w-32 h-32 object-cover rounded-xl mb-2"
                    />
                  )}
                  <FaSpinner className="animate-spin text-3xl" />
                  <span className="font-medium">Analyzing your dog...</span>
                  <span className="text-sm text-gray-500">Detecting breed and age</span>
                </div>
              ) : (
                <>
                  <FaCloudUploadAlt className="text-5xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drag & drop a photo here, or{' '}
                    <label className="text-bark-600 font-medium cursor-pointer hover:underline">
                      browse
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFile(file);
                        }}
                      />
                    </label>
                  </p>
                  <p className="text-xs text-gray-400">JPG, PNG up to 10MB</p>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={analyzeMutation.isPending}
              className="mt-6 w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
            >
              Skip — I'll add a photo later
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {preview && (
              <div className="flex justify-center mb-6">
                <img
                  src={preview}
                  alt="Your dog"
                  className="w-32 h-32 object-cover rounded-xl shadow-md"
                />
              </div>
            )}

            {aiDefaults.breed && (
              <p className="text-sm text-bark-600 text-center mb-4">
                AI detected: <strong>{aiDefaults.breed}</strong>, ~{aiDefaults.estimated_age}
              </p>
            )}

            <DogForm
              defaultValues={aiDefaults}
              onSubmit={handleSubmit}
              isSubmitting={createDogMutation.isPending}
              submitLabel="Add Dog & Continue"
            />

            <button
              type="button"
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
