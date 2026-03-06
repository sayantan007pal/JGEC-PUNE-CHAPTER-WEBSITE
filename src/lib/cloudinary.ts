import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const CLOUDINARY_FOLDER =
  process.env.CLOUDINARY_FOLDER || "jgec_pune_chapter/users/profile_pictures";
const CLOUDINARY_TIMEOUT = process.env.CLOUDINARY_TIMEOUT || 60000;

/**
 * [Stream-based] Uploads a File to Cloudinary using upload_stream.
 * Converts the File to a Buffer and pipes it through a writable stream.
 * Kept for reference — prefer `uploadToCloudinary` in serverless environments.
 * @returns The secure HTTPS URL of the uploaded image.
 */
export async function uploadToCloudinaryStream(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        public_id: `${Date.now()}_${file.name.replace(/\.[^.]+$/, "")}`,
        resource_type: "image",
        timeout: CLOUDINARY_TIMEOUT,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload returned no result"));
        } else {
          resolve(result.secure_url);
        }
      },
    );
    uploadStream.end(buffer);
  });
}

/**
 * [Recommended] Uploads a File to Cloudinary using a base64 data URI.
 * More reliable than upload_stream in serverless environments (Vercel, etc.)
 * because it avoids TCP stream stalls under tight execution time limits.
 * @returns The secure HTTPS URL of the uploaded image.
 */
export async function uploadToCloudinary(file: File): Promise<{ secure_url: string; public_id: string }> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;
  const publicId = `${Date.now()}_${file.name.replace(/\.[^.]+$/, "")}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: CLOUDINARY_FOLDER,
    public_id: publicId,
    resource_type: "image",
    timeout: Number(CLOUDINARY_TIMEOUT),
  });

  return { secure_url: result.secure_url, public_id: publicId };
}
