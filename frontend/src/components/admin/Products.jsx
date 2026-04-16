import AdminForm from "../AdminForm";
import AdminList from "../AdminList";

export default function Products({ refresh, setRefresh }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Manage Products
      </h1>

      {/* Add Product */}
      <div className="mb-8">
        <AdminForm onProductAdded={() => setRefresh(!refresh)} />
      </div>

      {/* Product List */}
      <div>
        <AdminList key={refresh} />
      </div>
    </div>
  );
}