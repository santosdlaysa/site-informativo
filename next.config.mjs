/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          // Previne ataques XSS
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Habilita proteção XSS do navegador
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Política de segurança de conteúdo - bloqueia recursos inline perigosos
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
          },
          // Força HTTPS (após configurar SSL)
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          // Previne clickjacking
          { key: "X-Frame-Options", value: "DENY" },
          // Controla referrer
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Proteção contra MIME sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Desabilita cache para páginas sensíveis
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=3600" },
        ],
      },
      // Headers específicos para rotas de autenticação - sem cache
      {
        source: "/admin/login",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
    ];
  },
};

export default nextConfig;
