import React from 'react';
import type { Order } from '../../types/order';

interface Props {
  order: Order | null;
  visible: boolean;
  processing: boolean;
  onConfirm: (o: Order | null) => void;
  onCancel: () => void;
}

const OrderPreviewModal: React.FC<Props> = ({ order, visible, processing, onConfirm, onCancel }) => {
  if (!visible || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 max-w-lg w-full">
        <h3 className="text-lg font-semibold mb-2">Confirm Your Order</h3>
        <div className="text-sm mb-3">
          <div>Order #{order.id ?? '—'}</div>
          <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
        </div>
        <div className="max-h-44 overflow-y-auto mb-3">
          {order.items.map((it, i) => (
            <div key={i} className="flex items-center justify-between py-1 border-b">
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-xs text-gray-500">{it.size ?? ''} {it.color ? `• ${it.color}` : ''}</div>
              </div>
              <div className="text-right">
                <div className="text-sm">Qty: {it.quantity ?? 1}</div>
                <div className="font-semibold">₦{(Number(it.price || 0)).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-3">
          <div className="text-sm">Shipping: {order.shipping?.state} — ₦{(order.shipping?.fee || 0).toLocaleString()}</div>
          <div className="text-lg font-bold mt-2">Total: ₦{(order.total || order.subtotal || 0).toLocaleString()}</div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => onConfirm(order)} disabled={processing} className="bg-green-600 text-white px-4 py-2 rounded">{processing ? 'Processing…' : 'Proceed to Payment'}</button>
          <button onClick={onCancel} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default OrderPreviewModal;
