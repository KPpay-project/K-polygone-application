import { useNavigate } from '@tanstack/react-router';

const NotFoundComponent = (route: string = '/') => {
  const Component = () => {
    const navigate = useNavigate();

    navigate({ to: route });
    return null;
  };

  return Component;
};

export default NotFoundComponent;
