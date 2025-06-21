import { createContext, useContext, useEffect, useState } from "react";

/**
 * @typedef {Object} ThemeContextType
 * @property {string} theme - The current theme ('light', 'dark', or 'system').
 * @property {(theme: string) => void} setTheme - Function to update the theme.
 */

/**
 * Initial state for ThemeProvider context.
 * @type {ThemeContextType}
 */
const initialState = {
  theme: "system",
  setTheme: () => {},
};

const ThemeProviderContext = createContext(initialState);

/**
 * ThemeProvider component to manage light/dark theme settings.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 * @param {string} [props.defaultTheme="system"] - Default theme to apply.
 * @param {string} [props.storageKey="vite-ui-theme"] - Local storage key for persisting theme.
 * @returns {JSX.Element} Theme provider component.
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(storageKey) || defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  /**
   * Updates the theme and saves it to local storage.
   * @param {string} newTheme - The new theme to set.
   */
  const updateTheme = (newTheme) => {
    localStorage.setItem(storageKey, newTheme);
    setTheme(newTheme);
  };

  return (
    <ThemeProviderContext.Provider
      value={{ theme, setTheme: updateTheme }}
      {...props}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

/**
 * Hook to use the theme context.
 * @returns {ThemeContextType} The theme context value.
 * @throws {Error} If used outside of ThemeProvider.
 */
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
