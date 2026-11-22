// Configuración de Vite para el front-end de autenticación
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    server: {
        // Reenvía las peticiones que empiezan por /api al servicio web (backend).
        // Así el navegador cree que todo viene del mismo origen y no bloquea la llamada (CORS).
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true
            }
        }
    }
});