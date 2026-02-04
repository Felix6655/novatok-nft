export default async function sitemap() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://novatok-nft.vercel.app";

  const routes = ["", "/marketplace", "/mint", "/my-nfts", "/create"].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
    })
  );

  return routes;
}

