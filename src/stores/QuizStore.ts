import { makeAutoObservable } from "mobx";
import {
  QUIZ_QUESTIONS,
  recommendQuizResult,
  type QuizQuestion,
  type QuizResult,
} from "../data/solnyshko";

/** Строка описи анкеты: что спросили и что записали в журнал. */
export interface QuizRecordRow {
  no: string;
  question: string;
  answer: string;
}

export class QuizStore {
  /** Ответы по пунктам анкеты; null — пункт ещё не заполнен. */
  answers: (string | null)[] = QUIZ_QUESTIONS.map(() => null);
  /** Текущий пункт; значение total означает, что анкета заполнена. */
  step = 0;

  constructor() {
    makeAutoObservable(this);
  }

  get total(): number {
    return QUIZ_QUESTIONS.length;
  }

  get current(): QuizQuestion | null {
    return this.step < QUIZ_QUESTIONS.length ? QUIZ_QUESTIONS[this.step] : null;
  }

  get answered(): number {
    return this.answers.filter((a) => a !== null).length;
  }

  get complete(): boolean {
    return this.step >= QUIZ_QUESTIONS.length;
  }

  get result(): QuizResult | null {
    return this.complete ? recommendQuizResult(this.answers) : null;
  }

  get record(): QuizRecordRow[] {
    return QUIZ_QUESTIONS.map((q, i) => {
      const option = q.options.find((o) => o.value === this.answers[i]);
      return {
        no: q.no,
        question: q.title,
        answer: option ? option.label : "не заполнено",
      };
    });
  }

  answer(value: string): void {
    if (this.complete || !this.current?.options.some((option) => option.value === value)) return;
    this.answers[this.step] = value;
    this.step += 1;
  }

  back(): void {
    if (this.step > 0) this.step -= 1;
  }

  reset(): void {
    this.answers = QUIZ_QUESTIONS.map(() => null);
    this.step = 0;
  }
}
