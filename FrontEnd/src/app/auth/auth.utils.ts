export const getUserIdFromToken = (token: string | null): number | undefined => {
  if (!token) return undefined;

  try {
    const payloadPart = token.split('.')[1];
    if (!payloadPart || typeof window === 'undefined' || !window.atob) return undefined;

    const normalizedBase64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const paddingLength = (4 - (normalizedBase64.length % 4)) % 4;
    const paddedBase64 = normalizedBase64 + '='.repeat(paddingLength);
    const decoded = window.atob(paddedBase64);
    const payload = JSON.parse(decoded) as { id?: number | string };
    const rawId = payload.id;
    if (rawId === undefined || rawId === null) return undefined;

    const parsedId = Number(rawId);
    return Number.isNaN(parsedId) ? undefined : parsedId;
  } catch (error) {
    return undefined;
  }
};
