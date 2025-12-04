import Order from '../model/order.model.js';

export const watchOrders = (io) => {
  try {
    const changeStream = Order.watch();

    changeStream.on('change', (change) => {
      console.log('Order thay đổi:', change.operationType);

      // Gửi realtime cho admin
      io.to('admin_room').emit('order_changed', {
        type: change.operationType, // 'insert', 'update', 'delete'
        orderId: change.documentKey?._id,
        data: change.fullDocument, // Data đầy đủ
        updatedFields: change.updateDescription?.updatedFields, // Chỉ field thay đổi
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