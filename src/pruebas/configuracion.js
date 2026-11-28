// Configuración común de las pruebas: se ejecuta antes de cada archivo de prueba
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

beforeEach(() => {
    sessionStorage.clear();
    // Ninguna prueba debe llamar a un servidor real: cada una instala su servidor falso si lo necesita
    vi.stubGlobal('fetch', () => Promise.reject(new Error('fetch sin simular en esta prueba')));
});

afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});
