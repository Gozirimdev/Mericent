import React from 'react';
import type { OrderItem } from '../../types/order';

interface Props {
  items: OrderItem[];
}

const OrdersTable: React.FC<Props> = ({ items }) => {
  const fmt = (n?: number | string) => {
    const num = typeof n === 'number' ? n : parseFloat(String(n || 0).replace(/[^0-9.-]+/g, '')) || 0;
    return `₦${num.toLocaleString()}`;
  };

  return (
    <div className="overflow-x-auto mb-4">
      {items.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
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
            {items.map((item, index) => {
              const unitPrice = parseFloat(String(item.price).replace(/[^0-9.-]+/g, '')) || 0;
              const qty = Number(item.quantity || 1);
              const lineTotal = unitPrice * qty;
              return (
                <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-3 flex items-center gap-3 w-1/3">
                    {item.img && <img src={item.img} alt={item.name} className="w-12 h-12 object-cover rounded" />}
                    <div>
                      <div className="font-medium">{item.name}</div>
                    </div>
                  </td>
                  <td className="py-3">
                    {item.size && <div>Size: <span className="font-medium">{item.size}</span></div>}
                    {item.color && <div>Color: <span className="font-medium">{item.color}</span></div>}
                  </td>
                  <td className="py-3 text-center">{qty}</td>
                  <td className="py-3 text-right">{fmt(unitPrice)}</td>
                  <td className="py-3 text-right font-semibold">{fmt(lineTotal)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrdersTable;
