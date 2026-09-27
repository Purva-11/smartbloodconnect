export const generateQRToken = (userId: string, campId: string, ticketId: string) => {
  const payload = JSON.stringify({ u: userId, c: campId, r: ticketId, t: Date.now() });
  return btoa(payload);
};

export const decodeQRToken = (token: string) => {
  try {
    return JSON.parse(atob(token));
  } catch (e) {
    return null;
  }
};
