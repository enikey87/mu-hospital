import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "./stores/RootStore";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Ug9Offer from "./components/Ug9Offer";
import MochaTicker from "./components/MochaTicker";
import Products from "./components/Products";
import Calculator from "./components/Calculator";
import Pricing from "./components/Pricing";
import Instructions from "./components/Instructions";
import Testimonials from "./components/Testimonials";
import Detector from "./components/Detector";
import Donor from "./components/Donor";
import Licenses from "./components/Licenses";
import Partners from "./components/Partners";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import NotFound from "./components/NotFound";
import SolnyshkoApp from "./components/SolnyshkoApp";

export default observer(function App({ initialNotFound }: { initialNotFound: boolean }) {
  const { router } = useStore();

  useEffect(() => {
    const target = router.section ? document.getElementById(router.section) : null;
    if (target) target.scrollIntoView({ behavior: "instant" });
    else window.scrollTo({ top: 0 });
  }, [router.route, router.program, router.section]);

  if (initialNotFound || router.route === "notFound") {
    return (
      <div className="noise">
        <NotFound />
      </div>
    );
  }

  if (router.route === "solnyshko" || router.route === "franchise") {
    return (
      <div className="sol">
        <SolnyshkoApp />
      </div>
    );
  }

  return (
    <div className="ut">
      <Header />
      <main>
        <Hero />
        <Ug9Offer />
        <MochaTicker />
        <Products />
        <Calculator />
        <Pricing />
        <Instructions />
        <Testimonials />
        <Detector />
        <Donor />
        <Licenses />
        <Partners />
        <Faq />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
});
