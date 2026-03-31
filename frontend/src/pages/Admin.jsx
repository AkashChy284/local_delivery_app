import AdminForm from "../components/AdminForm";
import AdminList from "../components/AdminList";

export default function Admin() {
  return (
    <div className="min-h-screen bg-green-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        Admin Panel
      </h1>

      <AdminForm />
      <AdminList />
    </div>
  );
}