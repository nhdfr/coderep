// Keep PostCSS config minimal. The project doesn't use Tailwind's
// PostCSS plugin, and Next's font loader will attempt to load any
// configured plugins during build. Use an empty plugins list to avoid
// requiring optional Tailwind packages.
const config = {
	plugins: [],
};

export default config;
