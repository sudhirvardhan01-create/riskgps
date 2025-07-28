// src/components/__tests__/testUtils.tsx
import { ReactNode } from "react";

// Mock next/link
jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => children,
}));

// Mock next/router
jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: () => ({
    push: jest.fn(),
    prefetch: jest.fn(),
    pathname: "/",
    // add anything else your component might read
  }),
}));

// Mock react-google-recaptcha
jest.mock("react-google-recaptcha", () => ({
  __esModule: true,
  default: ({ onChange }: { onChange: (value: string) => void }) => {
    if (onChange) onChange("mock-captcha-token");
    return <div data-testid="mock-recaptcha">Mock ReCAPTCHA</div>;
  },
}));
