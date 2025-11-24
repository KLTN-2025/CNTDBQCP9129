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
    res.status(500).json({ message: "Gửi liên hệ thất bại" });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }); 

    res.status(200).json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lấy danh sách liên hệ thất bại" });
  }
};

// Xóa contact theo ID
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Không tìm thấy liên hệ" });
    }

    res.json({ message: "Xóa liên hệ thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Xóa liên hệ thất bại" });
  }
};
