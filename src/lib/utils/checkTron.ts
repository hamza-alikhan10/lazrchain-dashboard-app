// lib/utils/checkTron.ts
export const isTronLinkInstalled = () => {
  const tronLink = (window as any).tronLink;
  const tronWeb = (window as any).tronWeb;
  return !!(tronLink && tronWeb);
};
