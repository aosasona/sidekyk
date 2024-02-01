/** @ts-ignore */
lucide.createIcons();

// Theme
const $html = document.querySelector("html") as HTMLElement;
const $themeIndicators = {
  light: document.querySelector("#theme-indicator-light") as HTMLElement,
  dark: document.querySelector("#theme-indicator-dark") as HTMLElement,
};

const theme = localStorage.getItem("theme") || "dark";

function loadTheme() {
  const theme = localStorage.getItem("theme") || "dark";
  if (theme === "dark") {
    $html.classList.add("dark");
    setThemeIcon("dark");
    return;
  }
  $html.classList.remove("dark");
  setThemeIcon("light");
}

function setThemeIcon(currentTheme: "dark" | "light") {
  const otherTheme = currentTheme === "dark" ? "light" : "dark";
  $themeIndicators[currentTheme].classList.remove("hidden");
  $themeIndicators[otherTheme].classList.add("hidden");
}

function toggleTheme() {
  $html.classList.toggle("dark");
  setThemeIcon($html.classList.contains("dark") ? "dark" : "light");
  localStorage.setItem("theme", $html.classList.contains("dark") ? "dark" : "light");
}

loadTheme();

document.querySelector("#theme-toggle")?.addEventListener("click", toggleTheme);
