import React from "react";

type OrderItem = {
  name?: string;
  price?: string | number;
  quantity?: number;
  size?: string;
  color?: string;
  img?: string;
};

type Order = {
  id?: string | number;
  userEmail?: string;
  items?: OrderItem[];
  subtotal?: number;
  shipping?: { state?: string; fee?: number };
  total?: number;
  createdAt?: string;
};

interface OrdersListProps {
  orders: Order[];
}

const fmt = (n?: number | string) => {
  const num = typeof n === 'number' ? n : parseFloat(String(n || 0).replace(/[^0-9.-]+/g, '')) || 0;
  return `₦${num.toLocaleString()}`;
};

const OrdersList: React.FC<OrdersListProps> = ({ orders }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-semibold mb-4">User Orders</h2>
      <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto">
        {(!orders || orders.length === 0) && <p>No orders yet.</p>}
        {orders.map((order, index) => (
          <div key={order.id ?? index} className="border-b border-gray-300 dark:border-gray-600 p-3">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold">Order #{order.id ?? index + 1}</div>
                <div className="text-xs text-gray-500">{order.userEmail ?? 'Guest'}</div>
                <div className="text-xs text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</div>
              </div>
              <div className="text-right">
                <div className="text-sm">Items: {order.items?.length ?? 0}</div>
                <div className="text-lg font-bold">{fmt(order.total ?? order.subtotal)}</div>
              </div>
            </div>

            {/* Items table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 dark:text-gray-300">
                    <th className="pb-2">Item</th>
                    <th className="pb-2">Details</th>
                    <th className="pb-2 text-center">Qty</th>
                    <th className="pb-2 text-right">Unit</th>
                    <th className="pb-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.items || []).map((it, i) => {
                    const unit = parseFloat(String(it.price || 0).replace(/[^0-9.-]+/g, '')) || 0;
                    const qty = Number(it.quantity ?? 1);
                    const line = unit * qty;
                    return (
                      <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="py-2 flex items-center gap-3 w-1/3">
                          {it.img && <img src={it.img} alt={it.name} className="w-10 h-10 object-cover rounded" />}
                          <div className="font-medium">{it.name}</div>
                        </td>
                        <td className="py-2">
                          {it.size && <div>Size: <span className="font-medium">{it.size}</span></div>}
                          {it.color && <div>Color: <span className="font-medium">{it.color}</span></div>}
                        </td>
                        <td className="py-2 text-center">{qty}</td>
                        <td className="py-2 text-right">{fmt(unit)}</td>
                        <td className="py-2 text-right font-semibold">{fmt(line)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Shipping & totals */}
            <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
              {order.shipping && (
                <div>Shipping: {order.shipping.state ?? ''} — {fmt(order.shipping.fee)}</div>
              )}
              <div className="mt-1 font-semibold">Order Total: {fmt(order.total ?? order.subtotal)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersList;
