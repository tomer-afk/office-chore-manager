import Lesson from '../models/Lesson.js';

export async function getLessons(req, res, next) {
  try {
    const isAdmin = req.user.role === 'admin';
    const categoryId = req.query.category_id;
    const lessons = await Lesson.findAll({ categoryId, publishedOnly: !isAdmin });
    const readSet = await Lesson.getUserReadLessons(req.user.id);
    const lessonsWithRead = lessons.map(l => ({ ...l, is_read: readSet.has(l.id) }));
    res.json({ lessons: lessonsWithRead });
  } catch (err) {
    next(err);
  }
}

export async function getLesson(req, res, next) {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    if (!lesson.is_published && req.user.role !== 'admin') {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    await Lesson.markAsRead(req.user.id, lesson.id);
    const readSet = await Lesson.getUserReadLessons(req.user.id);
    res.json({ lesson: { ...lesson, is_read: readSet.has(lesson.id) } });
  } catch (err) {
    next(err);
  }
}

export async function createLesson(req, res, next) {
  try {
    const lesson = await Lesson.create({ ...req.body, created_by: req.user.id });
    res.status(201).json({ lesson });
  } catch (err) {
    next(err);
  }
}

export async function updateLesson(req, res, next) {
  try {
    const lesson = await Lesson.update(req.params.id, req.body);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    res.json({ lesson });
  } catch (err) {
    next(err);
  }
}

export async function deleteLesson(req, res, next) {
  try {
    await Lesson.delete(req.params.id);
    res.json({ message: 'Lesson deleted' });
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req, res, next) {
  try {
    await Lesson.markAsRead(req.user.id, req.params.id);
    res.json({ message: 'Marked as read' });
  } catch (err) {
    next(err);
  }
}

export async function getUserProgress(req, res, next) {
  try {
    const progress = await Lesson.getUserProgress(req.user.id);
    res.json({ progress });
  } catch (err) {
    next(err);
  }
}
