// Configuración de las pruebas unitarias (Vitest)
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    test: {
        // jsdom simula un navegador para poder probar los componentes de React
        environment: 'jsdom',
        setupFiles: ['./src/pruebas/configuracion.js'],
        coverage: {
            provider: 'v8',
            include: ['src/**/*.{js,jsx}'],
            exclude: ['src/pruebas/**', 'src/**/*.test.{js,jsx}', 'src/main.jsx'],
            reporter: ['text', 'html']
        }
    }
});
