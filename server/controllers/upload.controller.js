import { asyncWrapper } from "../utils/asyncWrapper.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { cloudinaryConfig, signCloudinaryUpload } from "../config/cloudinary.js";

export const getCloudinarySignature = asyncWrapper(async (req, res) => {
  const { publicId } = req.body;
  const { cloudName, apiKey, folder } = cloudinaryConfig();

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = signCloudinaryUpload({ publicId, timestamp, folder });

  res.status(200).json(
    new ApiResponse({
      message: "Cloudinary signature issued.",
      data: {
        cloudName,
        apiKey,
        folder,
        publicId,
        timestamp,
        signature,
      },
    })
  );
});

