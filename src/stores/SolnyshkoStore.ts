import { makeAutoObservable, runInAction } from "mobx";
import { POWER_OPTIONS, PROGRAM_OPTIONS } from "../data/solnyshko";

export type BookingStatus = "form" | "sending" | "done";

export class SolnyshkoStore {
  name = "";
  program = "kalofores";
  power = "bear";
  status: BookingStatus = "form";
  voucher: string | null = null;
  private revision = 0;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setName(v: string): void {
    if (this.status === "form") this.name = v;
  }

  setProgram(v: string): void {
    if (this.status === "form" && PROGRAM_OPTIONS.some((p) => p.value === v)) this.program = v;
  }

  setPower(v: string): void {
    if (this.status === "form" && POWER_OPTIONS.some((p) => p.value === v)) this.power = v;
  }

  get canSubmit(): boolean {
    return this.name.trim().length >= 2 && PROGRAM_OPTIONS.some((p) => p.value === this.program) && POWER_OPTIONS.some((p) => p.value === this.power);
  }

  async submit(): Promise<void> {
    if (!this.canSubmit || this.status !== "form") return;
    const revision = this.revision;
    this.status = "sending";
    await new Promise((resolve) => setTimeout(resolve, 500));
    runInAction(() => {
      if (revision !== this.revision) return;
      this.status = "done";
      this.voucher = `СОЛ-1246-${Math.floor(1000 + Math.random() * 9000)}`;
    });
  }

  reset(): void {
    this.revision += 1;
    this.name = "";
    this.program = "kalofores";
    this.power = "bear";
    this.status = "form";
    this.voucher = null;
  }
}
