import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    files: [
      "components/Desktop.tsx",
      "components/LanguageSwitcher.tsx",
      "components/ProjectCarousel.tsx",
      "components/ProjectPreview.tsx",
      "components/Taskbar.tsx",
      "components/ThemeSwitcher.tsx",
    ],
    rules: {
      // Client hydration and third-party widget setup intentionally initialize state in effects.
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;
