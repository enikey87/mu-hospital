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

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setName(v: string): void {
    this.name = v;
  }

  setCity(v: string): void {
    this.city = v;
  }

  setDinner(v: string): void {
    this.dinner = v;
  }

  get canSubmit(): boolean {
    return (
      this.name.trim().length >= 2 &&
      this.city.trim().length >= 2 &&
      this.dinner.trim().length >= 2
    );
  }

  async submit(): Promise<void> {
    if (!this.canSubmit || this.status === "sending") return;
    this.status = "sending";
    await new Promise((r) => setTimeout(r, 1200));
    runInAction(() => {
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
    this.name = "";
    this.city = "";
    this.dinner = "";
    this.status = "form";
    this.submitted = null;
  }
}
