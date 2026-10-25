import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("turbine-theme") || "light");
  const [dir, setDir] = useState(localStorage.getItem("turbine-dir") || "ltr");
  const [layout, setLayout] = useState(localStorage.getItem("turbine-layout") || "vertical");
  const [primaryColor, setPrimaryColor] = useState(
    localStorage.getItem("turbine-primary-color") || "132 90 223"
  );
  const [navbarType, setNavbarType] = useState(localStorage.getItem("turbine-navbar-type") || "sticky");
  const [footerType, setFooterType] = useState(localStorage.getItem("turbine-footer-type") || "static");
  const [cardStyle, setCardStyle] = useState(localStorage.getItem("turbine-card-style") || "shadow");
  const [layoutRounded, setLayoutRounded] = useState(localStorage.getItem("layout-rounded") || "0.375rem");
  const [sidebarTheme, setSidebarTheme] = useState(localStorage.getItem("turbine-sidebar-theme") || "default");
  const [headerTheme, setHeaderTheme] = useState(localStorage.getItem("turbine-header-theme") || "default");
  const [sidebarBg, setSidebarBg] = useState(localStorage.getItem("turbine-sidebar-bg") || "none");

  // Theme
  useEffect(() => {
    const html = document.documentElement;

    if (theme === "dark") {
      html.classList.add("dark");
      html.classList.remove("light");
    } else if (theme === "light") {
      html.classList.remove("dark");
      html.classList.add("light");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        html.classList.add("dark");
        html.classList.remove("light");
      } else {
        html.classList.remove("dark");
        html.classList.add("light");
      }
    }

    localStorage.setItem("turbine-theme", theme);
  }, [theme]);

  // Direction
  useEffect(() => {
    document.documentElement.setAttribute("dir", dir);
    localStorage.setItem("turbine-dir", dir);
  }, [dir]);

  // Layout
  useEffect(() => {
    document.documentElement.setAttribute("data-layout", layout);
    localStorage.setItem("turbine-layout", layout);
  }, [layout]);

  //  PRIMARY COLOR FIX (MAIN PART)
  useEffect(() => {
    const html = document.documentElement;

    // Set the RGB component variable
    html.style.setProperty("--color-primary-rgb", primaryColor);

    localStorage.setItem("turbine-primary-color", primaryColor);
  }, [primaryColor]);

  // Navbar
  useEffect(() => {
    document.documentElement.setAttribute("data-nav-type", navbarType);
    localStorage.setItem("turbine-navbar-type", navbarType);
  }, [navbarType]);

  // Footer
  useEffect(() => {
    document.documentElement.setAttribute("data-footer-type", footerType);
    localStorage.setItem("turbine-footer-type", footerType);
  }, [footerType]);

  // Card Style
  useEffect(() => {
    document.documentElement.setAttribute("data-card-style", cardStyle);
    localStorage.setItem("turbine-card-style", cardStyle);
  }, [cardStyle]);

  // Layout Rounded
  useEffect(() => {
    document.documentElement.style.setProperty("--layout-radius", layoutRounded);
    localStorage.setItem("layout-rounded", layoutRounded);
  }, [layoutRounded]);

  // Sidebar Theme
  useEffect(() => {
    const html = document.documentElement;

    html.setAttribute("data-sidebar-theme", sidebarTheme);

    if (sidebarTheme === "brand") {
      html.style.setProperty("--sidebar-bg", `rgb(${primaryColor})`);
      html.style.setProperty("--sidebar-text", "#ffffff");
    } else {
      html.style.removeProperty("--sidebar-bg");
      html.style.removeProperty("--sidebar-text");
    }

    localStorage.setItem("turbine-sidebar-theme", sidebarTheme);
  }, [sidebarTheme, primaryColor]);

  // Header Theme
  useEffect(() => {
    document.documentElement.setAttribute("data-header-theme", headerTheme);
    localStorage.setItem("turbine-header-theme", headerTheme);
  }, [headerTheme]);

  // Sidebar Background
  useEffect(() => {
    const html = document.documentElement;

    if (sidebarBg !== "none") {
      html.style.setProperty("--sidebar-bg-img", `url(${sidebarBg})`);
      html.setAttribute("data-sidebar-bg", "true");
    } else {
      html.style.removeProperty("--sidebar-bg-img");
      html.removeAttribute("data-sidebar-bg");
    }

    localStorage.setItem("turbine-sidebar-bg", sidebarBg);
  }, [sidebarBg]);

  return (
    <ThemeContext.Provider
      value={{
        theme, setTheme,
        dir, setDir,
        layout, setLayout,
        primaryColor, setPrimaryColor,
        navbarType, setNavbarType,
        footerType, setFooterType,
        cardStyle, setCardStyle,
        layoutRounded, setLayoutRounded,
        sidebarTheme, setSidebarTheme,
        headerTheme, setHeaderTheme,
        sidebarBg, setSidebarBg,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);