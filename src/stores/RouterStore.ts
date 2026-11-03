import { makeAutoObservable } from "mobx";

export type Route = "main" | "solnyshko";

export class RouterStore {
  route: Route = "main";

  constructor() {
    makeAutoObservable(this);
    const sync = () => {
      this.route = window.location.hash.startsWith("#/solnyshko") ? "solnyshko" : "main";
      document.title = this.route === "solnyshko"
        ? "Пансионат «Солнышко» — программы пребывания"
        : "УринаТех — производство и поставка продукции";
      const description = document.querySelector('meta[name="description"]');
      description?.setAttribute("content", this.route === "solnyshko"
        ? "Пансионат «Солнышко», Республика Алтай. Стационарные программы, проживание и питание. Имеются противопоказания. 18+."
        : "УринаТех — производство продукции серии УТ, донорская программа и учёт партий. Имеются противопоказания. 18+.");
    };
    window.addEventListener("hashchange", sync);
    sync();
  }

  goMain(): void {
    window.location.hash = "#/";
  }

  goSolnyshko(): void {
    window.location.hash = "#/solnyshko";
  }
}
