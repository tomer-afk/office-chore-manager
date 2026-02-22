import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthCheck } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DogsPage from './pages/DogsPage';
import DogDetailPage from './pages/DogDetailPage';
import AddDogPage from './pages/AddDogPage';
import EditDogPage from './pages/EditDogPage';
import LessonsPage from './pages/LessonsPage';
import CategoryPage from './pages/CategoryPage';
import LessonDetailPage from './pages/LessonDetailPage';
import AdminLessonsPage from './pages/AdminLessonsPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import AdminLessonFormPage from './pages/AdminLessonFormPage';
import OnboardingPage from './pages/OnboardingPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  const { isLoading, isResolved } = useAuthCheck();

  if (isLoading && !isResolved) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        {/* Onboarding — full-screen, no layout */}
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dogs" element={<DogsPage />} />
          <Route path="/dogs/new" element={<AddDogPage />} />
          <Route path="/dogs/:id" element={<DogDetailPage />} />
          <Route path="/dogs/:id/edit" element={<EditDogPage />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/lessons/category/:id" element={<CategoryPage />} />
          <Route path="/lessons/:id" element={<LessonDetailPage />} />

          {/* Admin routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/lessons" element={<AdminLessonsPage />} />
            <Route path="/admin/lessons/new" element={<AdminLessonFormPage />} />
            <Route path="/admin/lessons/:id/edit" element={<AdminLessonFormPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          </Route>
        </Route>
      </Route>

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
