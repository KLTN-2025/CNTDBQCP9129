import Order from '../model/order.model.js';

export const watchOrders = (io) => {
  try {
    const changeStream = Order.watch();

    changeStream.on('change', async (change) => {
      console.log('Order thay đổi:', change.operationType);

      const orderId = change.documentKey?._id;

      // 🔥 Query lại đơn hàng + populate CHỈ các field yêu cầu
      const populatedOrder = await Order.findById(orderId)
        .populate("userId", "name email role")
        .populate("voucherId", "code");

      io.to('admin_room').emit('order_changed', {
        type: change.operationType,
        orderId,
        data: populatedOrder,               // ⬅️ đã format giống API getOrders
        updatedFields: change.updateDescription?.updatedFields,
        timestamp: new Date()
      });
    });

    changeStream.on('error', (error) => {
      console.error('Change stream error:', error);
    });

    console.log('Đã bật realtime cho Order collection');
  } catch (error) {
    console.error('Không thể bật Change Stream:', error);
  }
};
