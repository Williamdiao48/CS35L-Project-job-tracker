import DashboardLayout from "../components/DashboardLayout";
import Navbar from "../components/Navbar";
import JobMarketplace from "../components/JobMarketplace";

export default function Marketplace() {
  return (
    <DashboardLayout navbar={<Navbar />}>
      <JobMarketplace />
    </DashboardLayout>
  );
}
