import { v2 as cloudinary } from "cloudinary";

const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: true,
};

export const uploadImage = async (req, res, next) => {
    const { image, imageName } = req.body;
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_KEY,
        api_secret: process.env.CLOUD_SECRET,
    });

    try {
        const uploadResult = await cloudinary.uploader.upload(image, {
            public_id: imageName,
        });
        res.json(uploadResult);
    } catch (error) {
        next(error);
    }
};
