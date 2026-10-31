import { defineConfig, loadEnv } from 'vite';
import { handle } from './server/service.js';

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''));
  return {
  plugins: [{ name: 'lexradar-api', configureServer(server) { server.middlewares.use('/api', (req, res) => { req.url = '/api' + req.url; void handle(req, res); }); } }],
  base: './',
  css: { postcss: { plugins: [] } },
  server: { host: '127.0.0.1' },
}; });
