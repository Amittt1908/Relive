export const ORDER_STEPS = ['Placed', 'Confirmed', 'Shipped', 'Delivered'];

// New demo orders start as "Placed" and show as "Confirmed" after two minutes.
export function orderStatus(o) {
  if (o.status === 'Placed' && Date.now() - new Date(o.createdAt).getTime() > 2 * 60 * 1000) return 'Confirmed';
  return o.status;
}
export const canCancel = (o) => ['Placed', 'Confirmed'].includes(orderStatus(o));
