import { makeAutoObservable } from "mobx";
import {
  QUIZ_QUESTIONS,
  recommendQuizResult,
  type QuizQuestion,
  type QuizResult,
} from "../data/solnyshko";

export interface QuizRecordRow {
  no: string;
  question: string;
  answer: string;
}

export class QuizStore {
  answers: (string | null)[] = [null, null];
  step = 0;

  constructor() { makeAutoObservable(this); }

  get questions(): QuizQuestion[] {
    return QUIZ_QUESTIONS.filter(q => !q.when || q.when === this.answers[0]);
  }
  get total(): number { return this.questions.length; }
  get current(): QuizQuestion | null { return this.questions[this.step] ?? null; }
  get answered(): number { return this.answers.filter(a => a !== null).length; }
  get complete(): boolean { return this.step >= this.total; }
  get result(): QuizResult | null { return this.complete ? recommendQuizResult(this.answers) : null; }
  get record(): QuizRecordRow[] {
    return this.questions.map((q, i) => ({ no: q.no, question: q.title, answer: q.options.find(o => o.value === this.answers[i])?.label ?? "не заполнено" }));
  }
  answer(value: string): void {
    if (!this.current?.options.some(o => o.value === value)) return;
    if (this.step === 0) this.answers[1] = null;
    this.answers[this.step] = value;
    this.step += 1;
  }
  back(): void { if (this.step > 0) this.step -= 1; }
  reset(): void { this.answers = [null, null]; this.step = 0; }
}
