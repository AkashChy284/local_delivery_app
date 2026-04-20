export default function OrderSuccess({ show, orderId }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] px-4">
      <div className="bg-white rounded-3xl p-8 text-center shadow-2xl w-full max-w-sm animate-scale">
        <div className="flex justify-center mb-5">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center shadow-inner">
            <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center">
              <svg
                className="w-9 h-9 text-white"
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
        </div>

        <h2 className="text-2xl font-bold text-gray-800">
          Order Placed
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Your order has been placed successfully
        </p>

        {orderId && (
          <div className="mt-4 bg-green-50 border border-green-100 rounded-2xl px-4 py-3">
            <p className="text-xs text-gray-500">Order ID</p>
            <p className="text-sm font-semibold text-green-700 break-all">
              {orderId}
            </p>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4">
          Redirecting to order tracking...
        </p>
      </div>
    </div>
  );
}