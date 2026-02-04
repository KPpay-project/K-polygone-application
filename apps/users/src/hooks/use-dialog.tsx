export function useDialog() {
  const close = () => {
    document.getElementById('hxza')?.click();
  };

  return {
    close
  };
}
