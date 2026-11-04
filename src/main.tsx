import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import {
  RootStoreContext,
  createRootStore,
} from "./stores/RootStore";
import "./styles/global.css";
import "./styles/solnyshko.css";
import "./styles/urinatech.css";

const store = createRootStore();

// Читаем флаг редиректа с 404.html до первого рендера (StrictMode дважды
// вызывает инициализаторы useState, поэтому чтение вынесено сюда)
const notFound = (() => {
  try {
    const r = sessionStorage.getItem("ut-redirect");
    if (r) sessionStorage.removeItem("ut-redirect");
    const path = (r ?? "").split(/[?#]/)[0].replace(/\/+$/, "");
    return path !== "" && path !== import.meta.env.BASE_URL.replace(/\/+$/, "");
  } catch {
    return false;
  }
})();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootStoreContext.Provider value={store}>
      <App initialNotFound={notFound} />
    </RootStoreContext.Provider>
  </StrictMode>
);
