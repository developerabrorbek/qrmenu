export const jwtConfig = () => ({
  jwt: {
    accessKey: process.env.ACCESS_TOKEN_KEY,
    accessTime: parseInt(process.env.ACCESS_TOKEN_TIME) || 3600,
  },
});
