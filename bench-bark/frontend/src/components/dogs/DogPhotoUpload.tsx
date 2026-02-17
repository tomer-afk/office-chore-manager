import { useCallback, useState } from 'react';
import { FaCloudUploadAlt, FaSpinner } from 'react-icons/fa';
import { useUploadDogPhoto } from '../../hooks/useDogs';
import type { PhotoAnalysisResponse } from '../../types/dog';

interface DogPhotoUploadProps {
  dogId: number;
  currentPhotoUrl?: string | null;
  onAnalysis?: (analysis: PhotoAnalysisResponse['ai_analysis']) => void;
}

export default function DogPhotoUpload({ dogId, currentPhotoUrl, onAnalysis }: DogPhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentPhotoUrl || null);
  const [dragActive, setDragActive] = useState(false);
  const uploadMutation = useUploadDogPhoto();

  const handleFile = useCallback(
    (file: File) => {
      setPreview(URL.createObjectURL(file));
      uploadMutation.mutate(
        { id: dogId, file },
        {
          onSuccess: (data) => {
            if (data.ai_analysis && onAnalysis) {
              onAnalysis(data.ai_analysis);
            }
          },
        }
      );
    },
    [dogId, uploadMutation, onAnalysis]
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

  return (
    <div
      className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${
        dragActive ? 'border-bark-500 bg-bark-50' : 'border-gray-300'
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={() => setDragActive(false)}
      onDrop={onDrop}
    >
      {preview ? (
        <img src={preview} alt="Dog photo" className="w-48 h-48 object-cover rounded-xl mx-auto mb-3" />
      ) : (
        <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto mb-3" />
      )}

      {uploadMutation.isPending ? (
        <div className="flex items-center justify-center gap-2 text-bark-600">
          <FaSpinner className="animate-spin" />
          <span>Uploading & analyzing...</span>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-2">
            Drag & drop a photo, or{' '}
            <label className="text-bark-600 cursor-pointer hover:underline">
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
          <p className="text-xs text-gray-400">AI will detect breed and age from the photo</p>
        </>
      )}
    </div>
  );
}
