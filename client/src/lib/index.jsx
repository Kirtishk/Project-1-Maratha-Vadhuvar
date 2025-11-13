import axios from "axios";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "../constants";

const CLOUDINARY_CLOUD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const uploadFileToCloudinary = async (file, folderName) => {
  try {
    if (!file) {
      return { success: true, data: null };
    }

    // If it's already a string (URL), return it
    if (typeof file === "string") {
      return { success: true, data: { secure_url: file } };
    }

    // Web File object (from <input type="file">)
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", folderName);

    const response = await axios.post(CLOUDINARY_CLOUD_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return { success: true, data: { secure_url: response.data.secure_url } };
  } catch (error) {
    console.error("Upload failed:", error);
    return { success: false, msg: error.message };
  }
};
