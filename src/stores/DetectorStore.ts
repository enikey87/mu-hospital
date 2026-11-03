import { makeAutoObservable, runInAction } from "mobx";

export type Verdict =
  | { kind: "idle" }
  | { kind: "checking"; progress: number }
  | { kind: "genuine"; batch: string; purity: number; origin: string }
  | { kind: "fake"; batch: string; reason: string }
  | { kind: "error"; message: string };

const BATCHES: Record<string, { purity: number; origin: string }> = {
  "УТ-2002-0417": { purity: 99, origin: "донорская программа, г. Кимры; УТ-01 «Утренний»" },
  "УТ-2003-0004": { purity: 98, origin: "линия №4, Зинаида, аттестат №003; УТ-02 «Эталон»" },
  "УТ-2024-0001": { purity: 99, origin: "архив коллекционного выпуска УТ-К «II Сан», аукцион 2024 года" },
};

export class DetectorStore {
  batch = "";
  verdict: Verdict = { kind: "idle" };
  private revision = 0;

  constructor() {
    makeAutoObservable(this);
  }

  setBatch(value: string): void {
    this.revision += 1;
    this.batch = value;
    this.verdict = { kind: "idle" };
  }

  async check(): Promise<void> {
    if (this.verdict.kind === "checking") return;
    const code = this.batch.trim().toUpperCase();
    if (!/^УТ-\d{4}-\d{4}$/.test(code)) {
      this.verdict = { kind: "error", message: "Введите номер в формате УТ-ГГГГ-НННН, например УТ-2002-0417." };
      return;
    }
    const revision = this.revision;
    this.verdict = { kind: "checking", progress: 50 };
    await new Promise((resolve) => setTimeout(resolve, 360));
    runInAction(() => {
      if (revision !== this.revision) return;
      const entry = BATCHES[code];
      this.verdict = entry
        ? { kind: "genuine", batch: code, ...entry }
        : { kind: "fake", batch: code, reason: "номер отсутствует в опубликованном реестре компании" };
    });
  }
}
