import { FaDog } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center gap-1">
          <FaDog className="text-bark-400" />
          <span>Bench Bark</span>
        </div>
        <span>&copy; {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
