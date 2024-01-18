import { defineConfig } from 'astro/config';
import react from "@astrojs/react";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
    site: "https://deputados.fiscalizaja.com",
    integrations: [react()],
    output: "hybrid",
    prefetch: true,
    adapter: node({
        mode: "standalone"
    }),
    image: {
        domains: [
            'fiscalizaja.com',
            'camara.leg.br'
        ]
    }
});