export default function getDeliverySlots() {
  const now = new Date();
  let startHour = now.getHours();
  let startMinute = now.getMinutes();

  const firstHour = 9; 
  const lastHour = 23; 

  if (startHour < firstHour) {
    startHour = firstHour;
    startMinute = 0;
  } else {
    if (startMinute >= 30) {
      startHour += 1;
      startMinute = 0;
    } else {
      startMinute = 30;
    }
  }

  if (startHour > lastHour) return [];

  const slots = [];

  for (let h = startHour; h <= lastHour; h++) {
    for (let m = (h === startHour ? startMinute : 0); m < 60; m += 30) {
      if (h === lastHour && m > 0) break; 
      slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
  }

  return slots;
}
