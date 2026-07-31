/**
 * Applies the stored theme before first paint.
 *
 * This has to run synchronously in the document body — a `useEffect` would
 * paint the default stock first and then flip, which on a light-primary design
 * is a full-screen white flash for anyone who chose dark.
 */
const SCRIPT = `(function(){try{var t=localStorage.getItem('gcis.theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
