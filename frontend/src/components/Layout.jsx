import Navbar from "./Navbar";
import BottomNav from "./BottomNav";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <Navbar />

      <main className="pb-20 md:pb-0">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}