import React from 'react';
import type { DeliveryInfo } from '../../types/order';

interface Props {
  deliveryInfo: DeliveryInfo;
  onOpenDelivery: () => void;
}

const DeliveryDetails: React.FC<Props> = ({ deliveryInfo, onOpenDelivery }) => {
  return (
    <div className="flex-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Delivery Details</h2>

      <button onClick={onOpenDelivery} className="bg-primary text-white py-2 px-4 rounded-lg mb-4 hover:opacity-90">
        Add Delivery Details
      </button>

      {deliveryInfo.fullName ? (
        <div className="mb-4">
          <p className="font-semibold">{deliveryInfo.fullName}</p>
          <p className="text-sm">{deliveryInfo.email}</p>
          <p className="text-sm">{deliveryInfo.phoneCode} {deliveryInfo.phone}</p>
          <p className="text-sm">{deliveryInfo.countryName}{deliveryInfo.stateName ? `, ${deliveryInfo.stateName}` : ''}{deliveryInfo.cityName ? `, ${deliveryInfo.cityName}` : ''}</p>
        </div>
      ) : (
        <p className="mb-4 text-sm text-gray-600">No delivery details yet.</p>
      )}

      <h3 className="text-lg font-semibold mb-2">Shipping Method</h3>

      <p className="text-sm text-gray-600 mb-2">Select your shipping location and price on the right panel.</p>
      <textarea placeholder="Any note to the merchant..." className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 mb-4 resize-none dark:bg-gray-700 dark:text-white" rows={4} />
    </div>
  );
}

export default DeliveryDetails;
