/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_PRICE_DISCIPLE_MONTHLY: string;
  readonly VITE_STRIPE_PRICE_DISCIPLE_YEARLY: string;
  readonly VITE_STRIPE_PRICE_CHURCH_MONTHLY: string;
  readonly VITE_STRIPE_PRICE_CHURCH_YEARLY: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
