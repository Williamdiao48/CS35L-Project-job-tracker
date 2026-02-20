export default function DashboardLayout({ sidebar, navbar, children }) {
    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {sidebar}
  
        <div style={{ flex: 1 }}>
          {navbar}
  
          <main style={{ padding: "20px" }}>
            {children}
          </main>
        </div>
      </div>
    );
  }
  