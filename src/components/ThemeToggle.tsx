import useTheme from '../hooks/useTheme';

export default function ThemeToggle() {
  const { toggle } = useTheme();
  return (
    <button onClick={toggle} className="ml-auto text-2xl">
      🌓
    </button>
  );
}