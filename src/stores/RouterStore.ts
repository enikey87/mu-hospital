import { makeAutoObservable, runInAction } from "mobx";
import { SOL_PROGRAMS, type SolProgramId } from "../data/solPrograms";

export type Route = "urinatech" | "solnyshko" | "franchise" | "notFound";
const HOME_SECTIONS = ["sol-services", "sol-quiz", "sol-rooms", "sol-dining", "sol-staff", "sol-documents", "sol-faq", "sol-booking"];

const MANUFACTURER_SECTIONS = ["top", "ug9", "products", "calculator", "pricing", "instructions", "reviews", "detector", "donor", "licenses", "company", "faq"];

export class RouterStore {
  route: Route = "solnyshko";
  program: SolProgramId | null = null;
  section: string | null = null;

  constructor() {
    makeAutoObservable(this);
    const sync = () => runInAction(() => {
      const [rawPath, query = ""] = window.location.hash.slice(1).split("?");
      const path = rawPath.replace(/\/+$/, "");
      const program = SOL_PROGRAMS.find(p => path === `/solnyshko/${p.id}`);
      const legacySection = MANUFACTURER_SECTIONS.includes(path) ? path : null;
      this.route = path === "/solnyshko/franchise" ? "franchise"
        : path === "" || path === "/solnyshko" || program ? "solnyshko"
        : path === "/urinatech" || legacySection ? "urinatech" : "notFound";
      this.program = program?.id ?? null;
      const section = new URLSearchParams(query).get("section");
      const sections = this.route === "franchise" ? ["franchise-kit", "franchise-terms", "franchise-brief"]
        : this.route === "solnyshko" && !program ? HOME_SECTIONS
        : this.route === "urinatech" ? MANUFACTURER_SECTIONS : [];
      this.section = legacySection ?? (section && sections.includes(section) ? section : null);
      document.title = this.route === "franchise" ? "Франшиза калофореза — Калофорез-Кедр М2 · Солнышко"
        : program ? `${program.title} — пансионат «Солнышко»`
        : this.route === "solnyshko" ? "Пансионат «Солнышко» — программы пребывания"
        : this.route === "notFound" ? "404 — пансионат «Солнышко»" : "УринаТех — производство и поставка продукции";
      document.querySelector('meta[name="description"]')?.setAttribute("content", this.route === "franchise"
        ? "Франшиза калофореза с аппаратом «Калофорез-Кедр М2»: комплект кабинета, условия запуска и предварительный расчёт. 18+."
        : program?.meta
        ?? (this.route === "solnyshko" ? "Пансионат «Солнышко», Республика Алтай. Стационарные программы, проживание и питание. Имеются противопоказания. 18+."
          : this.route === "notFound" ? "Страница не найдена. Пансионат «Солнышко» и производитель «УринаТех»."
          : "УринаТех — производство продукции серии УТ, донорская программа и учёт партий. Имеются противопоказания. 18+."));
    });
    window.addEventListener("hashchange", sync);
    sync();
  }

  goMain(): void {
    window.location.hash = "#/";
  }

  goSolnyshko(section?: string): void {
    const hash = "#/" + (section && HOME_SECTIONS.includes(section) ? `?section=${section}` : "");
    if (window.location.hash === hash && section && HOME_SECTIONS.includes(section)) {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    } else window.location.hash = hash;
  }
}
