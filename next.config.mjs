import autoCert from "anchor-pki/auto-cert/integrations/next";
//~ import nextIntl from "next-intl/plugin"

const nextConfig = {
  compiler: {
    styledComponents: true
  }
}
const withAutoCert = autoCert({
  enabledEnv: "development",
});
//~ const withNextIntl = nextIntl('./i18n.js')

//~ export default withAutoCert(withNextIntl(nextConfig))
export default withAutoCert(nextConfig)
