import { v2 as cloudinary } from "cloudinary";

const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: true,
};

export const uploadImage = async (image) => {
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_KEY,
        api_secret: process.env.CLOUD_SECRET,
    });
    // console.log(cloudinary.api_key);
    // return new Promise((resolve, reject) => {
    //     cloudinary.uploader.upload(image, opts, (error, result) => {
    //         console.log(result);
    //         if (result && result.secure_url) {
    //             console.log(result.secure_url);
    //             return resolve(result.secure_url);
    //         }
    //         console.log(error.message);
    //         return reject({ message: error.message });
    //     });
    // });
    console.log("start");
    const uploadResult = await cloudinary.uploader.upload(
        image,
        { public_id: "test" }
        // opts,
        // (error, result) => {
        //     console.log(result);
        //     if (result && result.secure_url) {
        //         console.log(result.secure_url);
        //         return resolve(result.secure_url);
        //     }
        //     console.log(error.message);
        //     return reject({ message: error.message });
        // }
    );
    console.log(uploadResult);
};
