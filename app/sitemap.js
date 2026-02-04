export default async function sitemap() {
  const baseUrl = "https://novatok-98knleyf-novatok-free.vercel.app";

  const routes = ["", "/marketplace", "/mint", "/my-nfts", "/create"].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
    })
  );

  return routes;
}


