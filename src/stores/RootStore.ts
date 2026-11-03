import { createContext, useContext } from "react";
import { CartStore } from "./CartStore";
import { DetectorStore } from "./DetectorStore";
import { DonorStore } from "./DonorStore";
import { TestimonialsStore } from "./TestimonialsStore";
import { CalculatorStore } from "./CalculatorStore";
import { PollStore } from "./PollStore";
import { CookiesStore } from "./CookiesStore";
import { RouterStore } from "./RouterStore";
import { SolnyshkoStore } from "./SolnyshkoStore";
import { MochaStore } from "./MochaStore";
import { QuizStore } from "./QuizStore";

export interface RootStore {
  cart: CartStore;
  detector: DetectorStore;
  donor: DonorStore;
  testimonials: TestimonialsStore;
  calc: CalculatorStore;
  poll: PollStore;
  cookies: CookiesStore;
  router: RouterStore;
  solnyshko: SolnyshkoStore;
  mocha: MochaStore;
  quiz: QuizStore;
}

export function createRootStore(): RootStore {
  return {
    cart: new CartStore(),
    detector: new DetectorStore(),
    donor: new DonorStore(),
    testimonials: new TestimonialsStore(),
    calc: new CalculatorStore(),
    poll: new PollStore(),
    cookies: new CookiesStore(),
    router: new RouterStore(),
    solnyshko: new SolnyshkoStore(),
    mocha: new MochaStore(),
    quiz: new QuizStore(),
  };
}

export const RootStoreContext = createContext<RootStore | null>(null);

export function useStore(): RootStore {
  const store = useContext(RootStoreContext);
  if (!store) throw new Error("RootStoreContext не найден. Оберните App в провайдер.");
  return store;
}
