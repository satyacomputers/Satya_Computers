/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'www.notebookcheck.net' },
      { protocol: 'https', hostname: 'cdn.mos.cms.futurecdn.net' },
      { protocol: 'https', hostname: 'i.rtings.com' },
      { protocol: 'https', hostname: 'store.storeimages.cdn-apple.com' },
      { protocol: 'https', hostname: 'www.hp.com' },
      { protocol: 'https', hostname: 'psref.lenovo.com' },
      { protocol: 'https', hostname: 'www.dell.com' },
      { protocol: 'https', hostname: 'www.asus.com' },
      { protocol: 'https', hostname: 'dlcdnwebimgs.asus.com' },
      { protocol: 'https', hostname: 'www.notebookcheck.net' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'img.laptopninja.in' },
      { protocol: 'https', hostname: 'rukminim2.flixcart.com' },
      { protocol: 'https', hostname: 'images-cdn.ubuy.co.in' },
      { protocol: 'https', hostname: 'www.razer.com' },
      { protocol: 'https', hostname: 'in-media.apjonlinecdn.com' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/order_status',
        destination: '/order-status',
      },
    ];
  },
};

export default nextConfig;
