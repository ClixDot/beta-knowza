import dns from 'node:dns';
import { defineConfig, loadEnv, type Connect, type Plugin, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {}

/** Serves the CMS API from the Vite server, so local development needs no extra process. */
function cmsApi(): Plugin {
  let load: () => Promise<any>;
  const middleware: Connect.NextHandleFunction = (req, res, next) => {
    if (!req.url?.startsWith('/api/cms')) return next();
    load()
      .then(({ handleCmsRequest }) => handleCmsRequest(req, res))
      .catch(next);
  };
  return {
    name: 'knowza-cms-api',
    configureServer(server: ViteDevServer) {
      load = () => server.ssrLoadModule('/server/handler.ts');
      server.middlewares.use(middleware);
    },
    async configurePreviewServer(server) {
      const { createServer } = await import('vite');
      const loader = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' });
      load = () => loader.ssrLoadModule('/server/handler.ts');
      server.middlewares.use(middleware);
    },
  };
}

export default defineConfig(({ mode }) => {
  // Server-side secrets go to process.env for the API only. Vite exposes just VITE_ values to the browser.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ['MONGODB_', 'CLOUDINARY_']));
  return {
    plugins: [react(), cmsApi()],
    server: {
      port: 5173,
      host: true,
      allowedHosts: true,
      cors: true,
    },
  };
});
