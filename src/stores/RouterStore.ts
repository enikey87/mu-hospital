import { makeAutoObservable, runInAction } from "mobx";
import { SOL_PROGRAMS, type SolProgramId } from "../data/solPrograms";

export type Route = "main" | "solnyshko" | "notFound";
const HOME_SECTIONS = ["sol-services", "sol-quiz", "sol-rooms", "sol-dining", "sol-staff", "sol-documents", "sol-faq", "sol-booking"];

export class RouterStore {
  route: Route = "main";
  program: SolProgramId | null = null;
  section: string | null = null;

  constructor() {
    makeAutoObservable(this);
    const sync = () => runInAction(() => {
      const [rawPath, query = ""] = window.location.hash.slice(1).split("?");
      const path = rawPath.replace(/\/+$/, "");
      const program = SOL_PROGRAMS.find(p => path === `/solnyshko/${p.id}`);
      this.route = path === "/solnyshko" || program ? "solnyshko"
        : path.startsWith("/") && path !== "" ? "notFound" : "main";
      this.program = program?.id ?? null;
      const section = new URLSearchParams(query).get("section");
      this.section = this.route === "solnyshko" && !program && section && HOME_SECTIONS.includes(section) ? section : null;
      document.title = program ? `${program.title} — пансионат «Солнышко»`
        : this.route === "solnyshko" ? "Пансионат «Солнышко» — программы пребывания"
        : this.route === "notFound" ? "404 — УринаТех" : "УринаТех — производство и поставка продукции";
      document.querySelector('meta[name="description"]')?.setAttribute("content", program?.meta
        ?? (this.route === "solnyshko" ? "Пансионат «Солнышко», Республика Алтай. Стационарные программы, проживание и питание. Имеются противопоказания. 18+."
          : this.route === "notFound" ? "Страница не найдена. УринаТех и пансионат «Солнышко»."
          : "УринаТех — производство продукции серии УТ, донорская программа и учёт партий. Имеются противопоказания. 18+."));
    });
    window.addEventListener("hashchange", sync);
    sync();
  }

  goMain(): void {
    window.location.hash = "#/";
  }

  goSolnyshko(section?: string): void {
    const hash = "#/solnyshko" + (section && HOME_SECTIONS.includes(section) ? `?section=${section}` : "");
    if (window.location.hash === hash && section && HOME_SECTIONS.includes(section)) {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    } else window.location.hash = hash;
  }
}
