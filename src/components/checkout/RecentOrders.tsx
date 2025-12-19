import React from 'react';
import type { Order } from '../../types/order';

interface Props { orders: Order[] }

const RecentOrders: React.FC<Props> = ({ orders }) => {
  return (
    <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm">
      <h3 className="font-semibold mb-2">Your Recent Orders</h3>
      {orders.length === 0 ? (
        <p className="text-sm text-gray-500">You have no recent orders.</p>
      ) : (
        <ul className="space-y-2">
          {orders.map((o, i) => (
            <li key={o.id ?? i} className="border rounded p-2 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Order: {o.id ?? '—'}</div>
                  <div className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">Items: {o.items?.length ?? 0}</div>
                  <div className="text-sm font-semibold">₦{Number(o.total || o.subtotal || 0).toLocaleString()}</div>
                </div>
              </div>
              {o.shipping && <div className="text-xs text-gray-500 mt-2">Shipping: {o.shipping.state} — ₦{(o.shipping.fee || 0).toLocaleString()}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RecentOrders;
