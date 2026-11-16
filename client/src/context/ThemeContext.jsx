import {
  createContext,
  useState,
  useContext,
  useEffect
} from 'react';

// ETAPE 1 : DECLARER LE CONTEXTE
// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext(null);

// ETAPE 2 : FOURNIR LE CONTEXTE
export function ThemeProvider({ children }) {

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app_theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  // Fonction de modification du thème
  const toggleTheme = () => {
    setTheme((prev) =>
      prev === 'light' ? 'dark' : 'light'
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ETAPE 3 : HOOK PERSONNALISE
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme doit etre utilise a l interieur d un ThemeProvider'
    );
  }

  return context;
}