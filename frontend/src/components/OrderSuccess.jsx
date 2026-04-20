export default function OrderSuccess({ show }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-3xl p-8 text-center shadow-2xl w-[90%] max-w-sm animate-scale">
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800">
          Order Placed
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Your order has been placed successfully
        </p>
      </div>
    </div>
  );
}