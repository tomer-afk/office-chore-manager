import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { WEIGHT_UNITS } from '../../config/constants';
import type { Dog } from '../../types/dog';

const vaccinationSchema = z.object({
  name: z.string().min(1, 'Vaccination name required'),
  date: z.string().min(1, 'Date required'),
  notes: z.string().optional(),
});

const dogSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  breed: z.string().optional(),
  estimated_age: z.string().optional(),
  weight: z.coerce.number().positive().optional().or(z.literal('')),
  weight_unit: z.enum(['lbs', 'kg']).default('lbs'),
  gender: z.enum(['male', 'female', 'unknown']).optional(),
  special_needs: z.string().optional(),
  medical_notes: z.string().optional(),
  vaccination_records: z.array(vaccinationSchema).default([]),
});

export type DogFormData = z.infer<typeof dogSchema>;

interface DogFormProps {
  defaultValues?: Partial<DogFormData>;
  onSubmit: (data: DogFormData) => void;
  isSubmitting: boolean;
  submitLabel: string;
  dog?: Dog;
}

export default function DogForm({ defaultValues, onSubmit, isSubmitting, submitLabel }: DogFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<DogFormData>({
    resolver: zodResolver(dogSchema),
    defaultValues: {
      name: '',
      weight_unit: 'lbs',
      vaccination_records: [],
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'vaccination_records' });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            {...register('name')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bark-500 focus:border-transparent outline-none"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
          <input
            {...register('breed')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bark-500 focus:border-transparent outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Age</label>
          <input
            {...register('estimated_age')}
            placeholder="e.g., 2 years"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bark-500 focus:border-transparent outline-none"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
            <input
              type="number"
              step="0.1"
              {...register('weight')}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bark-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="w-24">
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
            <select
              {...register('weight_unit')}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bark-500 focus:border-transparent outline-none"
            >
              {WEIGHT_UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            {...register('gender')}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bark-500 focus:border-transparent outline-none"
          >
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Special Needs</label>
        <textarea
          {...register('special_needs')}
          rows={2}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bark-500 focus:border-transparent outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Medical Notes</label>
        <textarea
          {...register('medical_notes')}
          rows={2}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bark-500 focus:border-transparent outline-none"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Vaccination Records</label>
          <button
            type="button"
            onClick={() => append({ name: '', date: '', notes: '' })}
            className="text-sm text-bark-600 hover:text-bark-700 flex items-center gap-1"
          >
            <FaPlus className="text-xs" /> Add
          </button>
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 mb-2">
            <input
              {...register(`vaccination_records.${index}.name`)}
              placeholder="Vaccine name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-bark-500 focus:border-transparent outline-none"
            />
            <input
              type="date"
              {...register(`vaccination_records.${index}.date`)}
              className="px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-bark-500 focus:border-transparent outline-none"
            />
            <input
              {...register(`vaccination_records.${index}.notes`)}
              placeholder="Notes"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-bark-500 focus:border-transparent outline-none"
            />
            <button type="button" onClick={() => remove(index)} className="text-red-400 hover:text-red-600 px-2">
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-bark-500 hover:bg-bark-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
