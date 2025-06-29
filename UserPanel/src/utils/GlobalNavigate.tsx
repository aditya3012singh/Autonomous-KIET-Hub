// components/GlobalNavigate.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setGlobalNavigate } from '../utils/navigation';

const GlobalNavigate = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setGlobalNavigate(navigate);
  }, [navigate]);

  return null;
};

export default GlobalNavigate;
