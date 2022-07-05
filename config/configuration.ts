export default () => ({
  nodeEnv: process.env.NODE_ENV,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiry: process.env.JWT_EXPIRY,
  environments: {
    isLocal: () => process.env.NODE_ENV === 'local',
    isProduction: () => process.env.NODE_ENV === 'production',
    isStaging: () => process.env.NODE_ENV === 'staging',
  },
  msg91: {
    authKey: process.env.MSG91_AUTH_KEY,
    templateId: process.env.MSG91_TEMPLATE_ID,
  },
});
