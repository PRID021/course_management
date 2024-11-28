import Landing from "@/app/(nondashboard)/landing/page";
import Footer from "@/components/custom/Footer";
import NonDashBoardNavBar from "@/components/custom/NonDashBoardNavBar";

export default function Home() {
  return (
    <div className="nondashboard-layout">
      <NonDashBoardNavBar />
      <main className="nondashboard-layout__main">
        <Landing />
      </main>
      <Footer />
    </div>
  );
}
