export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  STRIPE_KEY: "pk_test_m6LANIYntqCScOMY0fZ2XGl4",
  s3: {
    REGION: "ap-south-1",
    BUCKET: "adite-notes-app-uploads",
  },
  apiGateway: {
    REGION: "ap-south-1",
    URL: "https://8fpieenw89.execute-api.ap-south-1.amazonaws.com/prod",
  },
  cognito: {
    REGION: "ap-south-1",
    USER_POOL_ID: "ap-south-1_lNnLORyB3",
    APP_CLIENT_ID: "4afkind566ip0qa3clqqas51dt",
    IDENTITY_POOL_ID: "ap-south-1:6a54b8bd-0a33-4945-83ab-35994abf7b6d",
  },
};
