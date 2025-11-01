import { useState } from 'react'
import { toast } from 'react-toastify';
const usePreviewImage = (limit) => {
  const [selectedFile, setSelectedFile] = useState([]);
  const maxSizeFile = 8 * 1024 * 1024;
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(selectedFile.length > limit - 1) return toast.error(`Bạn chỉ được phép đăng ${limit} ảnh`)
    if(file && file.type.startsWith("image/")){
      if(file.size > maxSizeFile){
        setSelectedFile([]);
        return
      } 
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setSelectedFile([...selectedFile, reader.result]);
      }
      e.target.value = "";
    }else {
      setSelectedFile([]);
    }
  }
  return {selectedFile, handleImageChange, setSelectedFile}
}

export default usePreviewImage
