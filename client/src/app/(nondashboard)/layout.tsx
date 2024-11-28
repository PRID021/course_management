import Footer from "@/components/custom/Footer";
import NonDashBoardNavBar from "@/components/custom/NonDashBoardNavBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="nondashboard-layout">
      <NonDashBoardNavBar />
      <main className="nondashboard-layout__main">{children}</main>
      <Footer />
    </div>
  );
}
