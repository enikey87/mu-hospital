import { makeAutoObservable } from "mobx";

export interface DosageResult {
  product: string;
  cups: number;
  course: number;
  liters: number;
  canisters: number;
}

export class CalculatorStore {
  weight = "70";
  age = "40";
  trust = 50;

  constructor() {
    makeAutoObservable(this);
  }

  setWeight(v: string): void {
    this.weight = v;
  }

  setAge(v: string): void {
    this.age = v;
  }

  setTrust(v: number): void {
    this.trust = v;
  }

  get result(): DosageResult | null {
    const w = Number(this.weight);
    const a = Number(this.age);
    if (!this.weight.trim() || !this.age.trim() || !Number.isFinite(w) || !Number.isFinite(a) || w < 1 || a < 18) return null;
    const t = this.trust;
    const cups = Math.min(5, Math.max(1, Math.round(w / 25 + (100 - t) / 50)));
    const course = 21 + (a >= 60 ? 7 : 0);
    const liters = Math.round(cups * 3 * 0.25 * course * 10) / 10;
    const canisters = Math.max(1, Math.ceil(liters / 10));
    const product =
      t < 34 ? "УТ-01 «Утренний»" : t < 67 ? "УТ-04 «Сеченовский»" : "УТ-02 «Эталон»";
    return { product, cups, course, liters, canisters };
  }
}
