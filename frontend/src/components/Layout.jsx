import Navbar from "./Navbar";

export default function Layout({ children }) {
  if (!children) return null; // safety

  return (
    <div className="min-h-screen bg-yellow-50">
      <Navbar />

      <main className="max-w-screen-xl mx-auto px-3 sm:px-6">
        {children}
      </main>
    </div>
  );
}