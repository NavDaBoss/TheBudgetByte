import '@testing-library/jest-dom'
import 'jest-canvas-mock';

import { jest } from "@jest/globals";
jest.mock("next/navigation", () => ({
    useRouter() {
        return {
            prefetch: () => null
        };
    }
}));
