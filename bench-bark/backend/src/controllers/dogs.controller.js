import Dog from '../models/Dog.js';
import { uploadImage, deleteImage } from '../services/cloudinaryService.js';
import { analyzeBreedAndAge } from '../services/aiService.js';
import { unlink } from 'fs/promises';

export async function getDogs(req, res, next) {
  try {
    const dogs = await Dog.findByUserId(req.user.id);
    res.json({ dogs });
  } catch (err) {
    next(err);
  }
}

export async function getDog(req, res, next) {
  try {
    const dog = await Dog.findById(req.params.id);
    if (!dog) return res.status(404).json({ error: 'Dog not found' });
    if (dog.user_id !== req.user.id) return res.status(403).json({ error: 'Not your dog' });
    res.json({ dog });
  } catch (err) {
    next(err);
  }
}

export async function createDog(req, res, next) {
  try {
    const dog = await Dog.create({ ...req.body, user_id: req.user.id });
    res.status(201).json({ dog });
  } catch (err) {
    next(err);
  }
}

export async function updateDog(req, res, next) {
  try {
    const owned = await Dog.isOwnedBy(req.params.id, req.user.id);
    if (!owned) return res.status(403).json({ error: 'Not your dog' });
    const dog = await Dog.update(req.params.id, req.body);
    res.json({ dog });
  } catch (err) {
    next(err);
  }
}

export async function deleteDog(req, res, next) {
  try {
    const dog = await Dog.findById(req.params.id);
    if (!dog) return res.status(404).json({ error: 'Dog not found' });
    if (dog.user_id !== req.user.id) return res.status(403).json({ error: 'Not your dog' });
    if (dog.photo_public_id) await deleteImage(dog.photo_public_id);
    await Dog.delete(req.params.id);
    res.json({ message: 'Dog deleted' });
  } catch (err) {
    next(err);
  }
}

export async function uploadPhoto(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const owned = await Dog.isOwnedBy(req.params.id, req.user.id);
    if (!owned) {
      await unlink(req.file.path).catch(() => {});
      return res.status(403).json({ error: 'Not your dog' });
    }

    const dog = await Dog.findById(req.params.id);
    if (dog.photo_public_id) await deleteImage(dog.photo_public_id);

    const { url, publicId } = await uploadImage(req.file.path);
    await unlink(req.file.path).catch(() => {});

    let aiResult = null;
    try {
      aiResult = await analyzeBreedAndAge(url);
    } catch (err) {
      console.error('AI analysis failed:', err.message);
    }

    const updateData = { photo_url: url, photo_public_id: publicId };
    if (aiResult && !aiResult.error) {
      updateData.ai_breed_confidence = aiResult.breed_confidence;
      updateData.ai_age_confidence = aiResult.age_confidence;
      updateData.ai_raw_response = aiResult;
    }

    const updated = await Dog.update(req.params.id, updateData);
    res.json({ dog: updated, ai_analysis: aiResult });
  } catch (err) {
    if (req.file) await unlink(req.file.path).catch(() => {});
    next(err);
  }
}
