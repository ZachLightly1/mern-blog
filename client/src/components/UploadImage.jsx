import React, { useState } from "react";

export default function UploadImage() {
    const [loading, setLoading] = useState(false);
    const [url, setUrl] = useState;

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const uploadImage = async (event) => {
        const file = event.target.files[0];
        const base64 = await convertBase64(file);
        setLoading(true);
        const res = fetch("/api/uploadImage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(base64),
        })
            .then((res) => {
                setUrl(res.data);
                alert("image uploaded successfully");
            })
            .then(() => setLoading(false))
            .catch((err) => console.log(err));
    };

    return <div>UploadImage</div>;
}
