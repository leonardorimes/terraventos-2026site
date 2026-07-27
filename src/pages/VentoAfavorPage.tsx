import { useLocation, useNavigate } from 'react-router-dom';
import VentoAfavor from '../components/VentoAfavor';

export default function VentoAfavorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  return <VentoAfavor onBack={() => navigate(from)} />;
}
