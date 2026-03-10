@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body, #root {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

body {
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overscroll-behavior: none;
}

::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #374151; border-radius: 2px; }

/* PWA safe area */
.safe-bottom { padding-bottom: env(safe-area-inset-bottom, 0px); }
.safe-top { padding-top: env(safe-area-inset-top, 0px); }

/* Animations */
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
@keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn { from{opacity:0} to{opacity:1} }
@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
@keyframes spin { to{transform:rotate(360deg)} }

.pulse { animation: pulse 1.5s infinite; }
.slide-up { animation: slideUp 0.3s ease forwards; }
.fade-in { animation: fadeIn 0.25s ease; }
.spin { animation: spin 1s linear infinite; }

.shimmer {
  background: linear-gradient(90deg, #1f2937 25%, #374151 50%, #1f2937 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* Tap highlight */
* { -webkit-tap-highlight-color: transparent; }
button, a { cursor: pointer; }

/* Scrollable without scrollbar */
.scroll-x { overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
.scroll-x::-webkit-scrollbar { display: none; }
.scroll-y { overflow-y: auto; scrollbar-width: none; -ms-overflow-style: none; }
.scroll-y::-webkit-scrollbar { display: none; }
