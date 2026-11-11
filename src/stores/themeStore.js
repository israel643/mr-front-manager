import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const isDark = ref(false);
  const lightTheme = 'mintice';
  const darkTheme = 'mintice-dark';

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || lightTheme;

    if (savedTheme) {
      isDark.value = savedTheme == darkTheme
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      isDark.value = prefersDark;
    }

    const theme = isDark.value ? darkTheme : lightTheme;
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme);
  }
  
  watch(isDark, (value) => {
    const theme = value ? darkTheme : lightTheme
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  })

  return {
    isDark,
    initTheme
  };
});
