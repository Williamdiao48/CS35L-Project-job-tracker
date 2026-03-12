import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import Navbar from "../components/Navbar";
import JobMarketplace from "../components/JobMarketplace";

export default function Marketplace() {
  const navigate = useNavigate();
  return (
    <DashboardLayout navbar={<Navbar onAddJobClick={() => navigate('/dashboard', { state: { openForm: true } })} />}>
      <JobMarketplace />
    </DashboardLayout>
  );
}
