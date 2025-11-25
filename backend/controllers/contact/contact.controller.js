import Contact from "../../model/contact.model.js";

export const createContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message || !phone) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin bắt buộc" });
    }
    const contact = await Contact.create({
      name,
      email,
      phone,
      message,
    });

    res.status(201).json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gửi lời nhắn thất bại" });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }); 

    res.status(200).json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lấy danh lời nhắn thất bại" });
  }
};

// Xóa contact theo ID
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Không tìm thấy lời nhắn" });
    }

    res.json({ message: "Xóa lời nhắn thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Xóa lời nhắn thất bại" });
  }
};
// Cập nhật đã đọc
export const markAsRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: "read" },
      { new: true }
    );

    if (!contact) return res.status(404).json({ message: "Không tìm thấy lời nhắn" });

    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Cập nhật trạng thái thất bại" });
  }
};
// Lấy lời nhắn đã đọc
export const getReadContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ status: "read" }).sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lấy danh sách đã đọc thất bại" });
  }
};

// Lấy lời nhắn chưa đọc
export const getUnreadContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ status: "new" }).sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lấy danh sách chưa đọc thất bại" });
  }
};
