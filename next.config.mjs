/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // As páginas administrativas e públicas leem do banco em tempo de execução;
  // imagens são servidas via data-URL ou caminhos locais, então não há domínios remotos a liberar.
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
};

export default nextConfig;
