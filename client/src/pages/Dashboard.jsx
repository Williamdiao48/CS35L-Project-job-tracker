import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import JobForm from "../components/JobForm";
import JobList from "../components/JobList";

export default function Dashboard() {
  // NEW: this state increments whenever a job is created
  const [refreshFlag, setRefreshFlag] = useState(0);

  return (
    <DashboardLayout
      sidebar={<Sidebar />}
      navbar={<Navbar />}
    >
      <h1>Dashboard</h1>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: 20,
        marginTop: 20
      }}>
        <div>
          <h2>Add Job</h2>

          {/* When a job is created, increment refreshFlag */}
          <JobForm onCreated={() => setRefreshFlag(f => f + 1)} />
        </div>

        <div>
          <h2>Jobs</h2>

          {/* Pass refreshFlag to JobList */}
          <JobList refresh={refreshFlag} />
        </div>
      </div>
    </DashboardLayout>
  );
}
