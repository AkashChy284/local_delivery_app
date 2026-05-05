import Navbar from "./Navbar";
import BottomNav from "./BottomNav";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#f6f7f8] text-gray-900">
      <Navbar />

      <main className="pb-24 md:pb-0">{children}</main>

      <BottomNav />
    </div>
  );
}