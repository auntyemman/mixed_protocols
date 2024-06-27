export const extractKeyFromUrl = (url: string): string => {
    const parsedUrl = new URL(url);
    return decodeURIComponent(parsedUrl.pathname.substring(1));
};