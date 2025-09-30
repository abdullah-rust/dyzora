import * as Minio from "minio";
import dotenv from "dotenv";

dotenv.config();
const {
  MINIO_ENDPOINT,
  MINIO_PORT,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_USE_SSL,
} = process.env;

const useSSL = MINIO_USE_SSL === "true";
// ... (Baaki code jaisa aap ne diya hai)
const minioClient = new Minio.Client({
  endPoint: MINIO_ENDPOINT || "localhost",
  port: MINIO_PORT ? parseInt(MINIO_PORT, 10) : 9000,
  accessKey: MINIO_ACCESS_KEY || "",
  secretKey: MINIO_SECRET_KEY || "",
  useSSL: useSSL,
});

// Is file ko dusri file mein import kar ke check kar sakte hain
// example: in your main file like `index.ts` or `server.ts`

async function checkMinioConnection() {
  try {
    const buckets = await minioClient.listBuckets();
    console.log("Minio se connection kamyab hai. Buckets ki list:", buckets);
  } catch (error) {
    console.error("Minio se connect hone mein masla hai:", error);
    // Yahan aapko credentials ki ghalti ya server down hone ka error milega
  }
}

// Check karein
checkMinioConnection();

const readOnlyPolicy = {
  Version: "2012-10-17",
  Statement: [
    {
      Effect: "Allow",
      Principal: { AWS: "*" },
      Action: ["s3:GetObject"],
      Resource: [
        "arn:aws:s3:::products/*", // Tumhara bucket name yahan use hoga
      ],
    },
  ],
};

async function ensureBucketPublicAccess() {
  const bucketName = "products";
  try {
    // Pehle dekho agar bucket exist karta hai
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      console.log(
        `Bucket ${bucketName} does not exist. Please create it first.`
      );
      return;
    }

    // Policy set karna
    await minioClient.setBucketPolicy(
      bucketName,
      JSON.stringify(readOnlyPolicy)
    );
    console.log(
      `✅ Success: Bucket '${bucketName}' policy set to Public Read.`
    );
  } catch (err) {
    console.error("❌ Failed to set MinIO bucket policy:", err);
  }
}

ensureBucketPublicAccess();

export { minioClient };
