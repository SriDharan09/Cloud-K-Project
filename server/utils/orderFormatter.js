const formatOrderResponse = (orders) => {
    return orders.map((order) => ({
      orderDetails: {
        id: order.id,
        total_price: parseFloat(order.total_price).toFixed(2),
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        notes: order.notes,
        specialInstructions: order.specialInstructions,
        discountAmount: parseFloat(order.discountAmount).toFixed(2),
        taxAmount: parseFloat(order.taxAmount).toFixed(2),
        trackingNumber: order.trackingNumber,
        estimatedDeliveryTime: order.estimatedDeliveryTime,
        cancelledAt: new Date(order.cancelledAt).toLocaleString(),
        completedAt: new Date(order.completedAt).toLocaleString(),
        createdAt: new Date(order.createdAt).toLocaleString(),
        updatedAt: new Date(order.updatedAt).toLocaleString(),
      },
      customerDetails: order.User,
      branchDetails: order.Branch,
      items: order.OrderItems.map((item) => ({
        id: item.id,
        name: item.MenuItem?.name || null,
        quantity: item.quantity,
        price: parseFloat(item.price).toFixed(2),
        total: (item.quantity * parseFloat(item.price)).toFixed(2),
      })),
    }));
  };
  
  module.exports = { formatOrderResponse };
  