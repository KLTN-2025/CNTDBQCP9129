import { useState } from 'react'

const usePreviewImage = () => {
  const [selectedFile, setSelectedFile] = useState([]);
  const [error, setError] = useState('')
  const maxSizeFile = 2 * 1024 * 1024;
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(selectedFile.length > 2) return setError("Bạn đã đăng quá số ảnh cho phép")
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
    }else {
      setSelectedFile([]);
    }
  }
  return {selectedFile, handleImageChange, setSelectedFile, error, setError}
}

export default usePreviewImage
