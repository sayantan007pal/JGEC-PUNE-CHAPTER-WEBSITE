import "server-only";
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
 * Uploads a File to Cloudinary using a base64 data URI.
 * @returns The secure HTTPS URL of the uploaded image.
 */
export async function uploadToCloudinary(
  file: File,
  userName: string,
): Promise<{ secure_url: string; public_id: string }> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;
  const publicId = `${Date.now()}_${userName.replace(/\.[^.]+$/, "")}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: CLOUDINARY_FOLDER,
    public_id: publicId,
    resource_type: "image",
    timeout: Number(CLOUDINARY_TIMEOUT),
  });

  return { secure_url: result.secure_url, public_id: result.public_id };
}

export async function deleteFromCloudinary(publicId: string) {
  await cloudinary.uploader.destroy(publicId);
}
