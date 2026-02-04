import Logo from '../misc/logo';

const DefaultGlobalLoader = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-bounce">
          <Logo />
        </div>
      </div>
    </div>
  );
};
export default DefaultGlobalLoader;
