import { SUPPORTED_WALLETS, WALLETS } from "./wallets";

const BASE_API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://plankton-app-df43x.ondigitalocean.app";

export { SUPPORTED_WALLETS, WALLETS, BASE_API_URL };
