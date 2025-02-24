const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
    theme: {
        extend: { backgroundOpacity: ["responsive", "hover", "focus"] },
    },
    plugins: [flowbite.plugin()],
    darkMode: "class",
};
