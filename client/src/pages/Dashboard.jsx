import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import JobForm from "../components/JobForm";
import JobList from "../components/JobList";

export default function Dashboard() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />

        <div style={{ padding: "20px" }}>
          <h1>Dashboard</h1>
          <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:20}}>
            <div>
              <h2>Add Job</h2>
              <JobForm onCreated={() => { /* could refresh list via context or prop */ }} />
            </div>
            <div>
              <h2>Jobs</h2>
              <JobList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
