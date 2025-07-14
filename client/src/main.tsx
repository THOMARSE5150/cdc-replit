import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// ✅ Preload Critical Images
const preloadCriticalAssets = () => {
  const criticalImages = [
    "/images/celia-portrait-optimized.webp",
    "/images/logo.png",
  ];

  criticalImages.forEach((imagePath) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = imagePath;
    document.head.appendChild(link);
  });
};

// ✅ Preload Fonts (Optional but good for perf)
const preloadFonts = () => {
  const fontFiles = ["/fonts/inter-var.woff2"];

  fontFiles.forEach((fontPath) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "font";
    link.href = fontPath;
    link.type = "font/woff2";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  });
};

// ✅ Redirect specific deep links to homepage if directly hit
const directAccessPaths = [
  "/booking",
  "/fees",
  "/faq",
  "/services",
  "/client-diversity",
  "/meet-celia",
  "/contact",
];

if (
  directAccessPaths.includes(window.location.pathname) &&
  window.location.search === "" &&
  window.location.hash === ""
) {
  window.history.replaceState({}, "", "/");
}

// ✅ Execute preloads before hydration
preloadCriticalAssets();
preloadFonts();

// ✅ Hydrate app
const rootEl = document.getElementById("root");
if (rootEl) {
  const root = createRoot(rootEl);
  root.render(<App />);
} else {
  console.error("❌ Root element not found — check index.html or Vite config.");
}