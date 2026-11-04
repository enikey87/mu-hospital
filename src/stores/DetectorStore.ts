import { makeAutoObservable, runInAction } from "mobx";
import { ARCHIVE_BATCHES } from "../data/company";

export type Verdict =
  | { kind: "idle" }
  | { kind: "checking"; progress: number }
  | { kind: "genuine"; batch: string; origin: string }
  | { kind: "fake"; batch: string; reason: string }
  | { kind: "error"; message: string };

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
      const entry = ARCHIVE_BATCHES[code];
      this.verdict = entry
        ? { kind: "genuine", batch: code, ...entry }
        : { kind: "fake", batch: code, reason: "номер отсутствует в опубликованном реестре компании" };
    });
  }
}
