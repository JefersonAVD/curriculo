module.exports = {
  reactStrictMode: true,
  async headers(){
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          }
        ],
      },
    ]
  },
  env: {
    NOTION_KEY: 'secret_FyPGNZpSrbBWu2E0sdJ8RossldMGAccdxmXz0UFI1Tc',
  },

}
