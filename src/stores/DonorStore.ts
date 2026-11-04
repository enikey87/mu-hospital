import { makeAutoObservable, runInAction } from "mobx";

export type DonorStatus = "form" | "sending" | "done";

export interface DonorApplication {
  name: string;
  city: string;
  dinner: string;
  id: string;
}

export class DonorStore {
  name = "";
  city = "";
  dinner = "";
  status: DonorStatus = "form";
  submitted: DonorApplication | null = null;
  private revision = 0;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setName(v: string): void {
    if (this.status === "form") this.name = v;
  }

  setCity(v: string): void {
    if (this.status === "form") this.city = v;
  }

  setDinner(v: string): void {
    if (this.status === "form") this.dinner = v;
  }

  get canSubmit(): boolean {
    return (
      this.name.trim().length >= 2 &&
      this.city.trim().length >= 2 &&
      this.dinner.trim().length >= 2
    );
  }

  async submit(): Promise<void> {
    if (!this.canSubmit || this.status !== "form") return;
    const revision = this.revision;
    this.status = "sending";
    await new Promise((r) => setTimeout(r, 1200));
    runInAction(() => {
      if (revision !== this.revision) return;
      this.status = "done";
      this.submitted = {
        name: this.name.trim(),
        city: this.city.trim(),
        dinner: this.dinner.trim(),
        id: `MOCHA-${Math.floor(1000 + Math.random() * 9000)}`,
      };
    });
  }

  reset(): void {
    this.revision += 1;
    this.name = "";
    this.city = "";
    this.dinner = "";
    this.status = "form";
    this.submitted = null;
  }
}
