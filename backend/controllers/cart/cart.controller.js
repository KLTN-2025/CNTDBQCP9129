import Cart from "../../model/cart.model.js";
// lấy dữ liệu giỏ hàng
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart)
      return res.status(201).json({ message: "Không tìm thấy giỏ hàng" });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message } || "lỗi server");
  }
};
// Tạo giỏ hàng hoặc thêm món vào giỏ hàng
export const addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity, note } = req.body;
    if (!quantity || quantity < 1) return res.status(400).json({message: "Số lượng không được nhỏ hơn 1"});
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            quantity,
            note,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId && item.note === note
      );
      if (existingItem && existingItem.note === note) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity, note });
      }
    }
    await cart.save();
    const populatedCart = await cart.populate("items.productId");
    res.status(200).json(populatedCart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
// Xóa sản phẩm khỏi giỏ hàng
export const removeCartItem = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, note } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart)
      return res.status(400).json({ message: "Không tìm thấy giỏ hàng" });
    console.log(note);
    cart.items = cart.items.filter((item) => !(item.productId.toString() === productId && item.note === note));
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Cập nhật item trong giỏ hàng
export const updateCartItem = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity, note } = req.body;
    if (!quantity || quantity < 1) return res.status(400).json({message: "Số lượng không được nhỏ hơn 1"});
    const cart = await Cart.findOne({userId});
    if (!cart)
      return res.status(400).json({ message: "Không tìm thấy giỏ hàng" });

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (!existingItem)
      return res
        .status(400)
        .json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
    if (quantity) existingItem.quantity = quantity;
    if (note) existingItem.note = note;
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Lỗi server"});
  }
};
// Xóa toàn bộ giỏ hàng
export const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Đã xóa toàn bộ giỏ hàng" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
