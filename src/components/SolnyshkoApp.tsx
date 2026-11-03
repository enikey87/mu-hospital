import SolHeader from "./solnyshko/SolHeader";
import SolHero from "./solnyshko/SolHero";
import SolQuiz from "./solnyshko/SolQuiz";
import SolServices from "./solnyshko/SolServices";
import SolProfiles from "./solnyshko/SolProfiles";
import SolStation from "./solnyshko/SolStation";
import SolEnemas from "./solnyshko/SolEnemas";
import SolKalofores from "./solnyshko/SolKalofores";
import SolRoots from "./solnyshko/SolRoots";
import SolRooms from "./solnyshko/SolRooms";
import SolDining from "./solnyshko/SolDining";
import SolPromos from "./solnyshko/SolPromos";
import SolStaff from "./solnyshko/SolStaff";
import SolReviews from "./solnyshko/SolReviews";
import SolBooking from "./solnyshko/SolBooking";
import SolDocuments from "./solnyshko/SolDocuments";
import SolFaq from "./solnyshko/SolFaq";
import SolFooter from "./solnyshko/SolFooter";

export default function SolnyshkoApp() {
  return (
    <>
      <SolHeader />
      <main>
        <SolHero />
        <SolServices />
        <SolQuiz />
        <SolProfiles />
        <SolStation />
        <SolEnemas />
        <SolKalofores />
        <SolRoots />
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
