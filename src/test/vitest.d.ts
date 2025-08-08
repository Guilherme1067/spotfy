/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

interface CustomMatchers<R = unknown> {
  toBeInTheDocument(): R
  toHaveClass(...classNames: string[]): R
  toHaveAttribute(attr: string, value?: string): R
  toHaveFocus(): R
  toHaveDisplayValue(value: string): R
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
} 