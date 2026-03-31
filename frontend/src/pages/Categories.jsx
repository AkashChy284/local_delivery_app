import { Link } from "react-router-dom";

export default function Categories() {
  const data = [
    {
      name: "Groceries",
      img: "https://images.unsplash.com/photo-1586201375761-83865001e31c",
      desc: "Rice, flour, snacks & more",
    },
    {
      name: "Fruits & Vegetables",
      img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf",
      desc: "Fresh produce from markets",
    },
    {
      name: "Medicines",
      img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5",
      desc: "Pharmacy & health items",
    },
    {
      name: "Home Essentials",
      img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
      desc: "Daily household needs",
    },
  ];

  return (
    <div className="px-6 py-10">
      <h2 className="text-center text-xl font-semibold mb-6">
        Popular Categories
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {data.map((item, i) => (
          
          <Link
            key={i}
            to={`/products?cat=${encodeURIComponent(item.name)}`}
          >
            <div className="bg-white rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition p-3 cursor-pointer">
              
              <img
                src={item.img}
                alt=""
                className="h-28 w-full object-cover rounded-lg"
              />

              <h3 className="mt-2 font-semibold">{item.name}</h3>
              <p className="text-xs text-gray-500">{item.desc}</p>

            </div>
          </Link>

        ))}
      </div>
    </div>
  );
}