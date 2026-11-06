import { observer } from "mobx-react-lite";
import { useStore } from "../stores/RootStore";
import SolProgramPage from "./solnyshko/SolProgramPage";
import SolFranchise from "./solnyshko/SolFranchise";
import SolHeader from "./solnyshko/SolHeader";
import SolHero from "./solnyshko/SolHero";
import SolQuiz from "./solnyshko/SolQuiz";
import SolServices from "./solnyshko/SolServices";
import SolProfiles from "./solnyshko/SolProfiles";
import SolRooms from "./solnyshko/SolRooms";
import SolDining from "./solnyshko/SolDining";
import SolPromos from "./solnyshko/SolPromos";
import SolStaff from "./solnyshko/SolStaff";
import SolReviews from "./solnyshko/SolReviews";
import SolBooking from "./solnyshko/SolBooking";
import SolDocuments from "./solnyshko/SolDocuments";
import SolFaq from "./solnyshko/SolFaq";
import SolFooter from "./solnyshko/SolFooter";

function SolnyshkoApp() {
  const { router } = useStore();
  if (router.route === "franchise") return <SolFranchise />;
  if (router.program) return <SolProgramPage id={router.program} />;
  return (
    <>
      <SolHeader />
      <main>
        <SolHero />
        <SolServices />
        <SolQuiz />
        <SolProfiles />
        <SolRooms />
        <SolDining />
        <SolPromos />
        <SolStaff />
        <SolReviews />
        <SolBooking />
        <SolDocuments />
        <SolFaq />
      </main>
      <SolFooter />
    </>
  );
}

export default observer(SolnyshkoApp);
