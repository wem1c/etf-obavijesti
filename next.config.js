/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    // https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry
    // cnr == Montenegrin
    locales: ["cnr"],
    defaultLocale: "cnr",
  },
};

module.exports = nextConfig;
