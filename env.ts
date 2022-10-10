if (process.env.AUTH_METHOD && !["Basic", "OAuth"].includes(process.env.AUTH_METHOD)) {
  console.log(`AUTH_METHOD must be 'Basic' or 'OAuth', received value: '${process.env.AUTH_METHOD}'`);
  process.exit(1);
}

const environment = <Environment>{
  // URL for the platform
  platformUrl: process.env.PLATFORM_URL || "https://your-platform-url.davra.com",
  // URL for the application under test
  baseUrl: process.env.BASE_URL || "https://your-app-url.apps.davra.com/",

  // Admin user credentials
  auth: {
    username: process.env.ADMIN_USERNAME || "",
    password: process.env.ADMIN_PASSWORD || "",
  },

  authenticationMethod: <"Basic" | "OAuth">process.env.AUTH_METHOD || "OAuth",
};

export default environment;

interface Environment {
  platformUrl: string;
  baseUrl: string;
  auth: {
    username: string;
    password: string;
  };
  authenticationMethod: "Basic" | "OAuth";
}
