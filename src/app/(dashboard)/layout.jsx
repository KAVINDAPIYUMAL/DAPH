import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DashboardLayout({ children }) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Navbar />
      <main className="global-wrapper" style={{ flex: 1, marginTop: "66px" }}>
        <div className="container" style={{ maxWidth: "1400px", padding: "0 14px" }}>{children}</div>
      </main>
      <Footer />
    </div>
  );
}
