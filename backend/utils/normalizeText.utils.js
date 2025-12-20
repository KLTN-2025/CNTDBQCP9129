export const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")                
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, "")    
    .trim();
};
