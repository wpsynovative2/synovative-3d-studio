export const THEME_STORAGE_KEY = "theme";

/**
 * Inlined in <head> so the theme is applied before first paint (no flash) — same behaviour as
 * synovative.vercel.app: a stored choice wins, otherwise follow the OS setting.
 */
export const themeInitScript = `(function(){try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;
