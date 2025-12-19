import type { Order, DeliveryInfo } from "../types/order";

export const defaultShippingStates = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta",
  "Ebonyi","Edo","Ekiti","Enugu","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara",
  "Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara","FCT"
];

export async function fetchShippingOptions(): Promise<{ state: string; price: number }[]> {
  try {
    const res = await fetch("/api/shipping-prices");
    if (!res.ok) throw new Error("failed");
    const data = await res.json();
    if (Array.isArray(data)) return data;
  } catch (err) {
    // ignore and return fallback
  }
  return defaultShippingStates.map((s) => ({ state: s, price: 2500 }));
}

export async function fetchOrders(): Promise<Order[]> {
  try {
    const res = await fetch("/api/orders");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data.reverse();
    }
  } catch (err) {
    // ignore
  }

  try {
    const raw = localStorage.getItem("my_orders");
    if (raw) return JSON.parse(raw);
  } catch (err) {}

  return [];
}

export function persistOrderLocal(order: Order) {
  try {
    const raw = localStorage.getItem("my_orders");
    const arr = raw ? JSON.parse(raw) : [];
    arr.unshift(order);
    localStorage.setItem("my_orders", JSON.stringify(arr));
    return arr;
  } catch (err) {
    console.error(err);
    return [order];
  }
}

export async function createOrderOnServer(payload: Partial<Order>): Promise<Order | null> {
  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (res.ok) return json.order ?? json.data ?? json;
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function createPayment(order: Order) {
  try {
    const res = await fetch("/api/create-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: order.total || order.subtotal || 0,
        items: order.items,
        shipping: order.shipping,
        delivery: order.delivery,
        orderId: order.id,
      }),
    });
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}
