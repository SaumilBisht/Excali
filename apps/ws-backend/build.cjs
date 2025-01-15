const { build } = require('esbuild');

build({
  entryPoints: ['src/index.ts'], // Adjust if needed
  bundle: true,
  platform: 'node',
  outfile: 'dist/index.cjs',
  target: 'es2020',
  sourcemap: true,
  format: 'cjs',
}).catch(() => process.exit(1));
