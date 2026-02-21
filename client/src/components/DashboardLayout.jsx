export default function DashboardLayout({ navbar, children }) {
  return (
    <div className="app-container">
      {navbar}
      <div className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
}
  