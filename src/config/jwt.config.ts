export const jwtConfig = () => ({
  jwt: {
    accessKey: process.env.ACCESS_TOKEN_KEY,
    accessTime: parseInt(process.env.ACCESS_TOKEN_TIME) || 3600,
    refreshKey: process.env.REFRESH_TOKEN_KEY,
    refreshTime: parseInt(process.env.REFRESH_TOKEN_TIME) || 86400 * 7,
  },
});
