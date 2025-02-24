import { Alert, Button, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
    updateStart,
    updateSuccess,
    updateFailure,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function DashProfile() {
    const { currentUser } = useSelector((state) => state.user);
    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const filePickerRef = useRef();
    const dispatch = useDispatch();
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    };
    useEffect(() => {
        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

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
        setUploading(true);
        const fileName = new Date().getTime() + imageFile.name;

        const file = imageFile;
        const base64 = await convertBase64(file);
        const res = await fetch("/api/image/upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: base64, imageName: fileName }),
        });
        const data = await res.json();
        if (data.success === false) {
            setImageFileUploadError(data.message);
            setUploading(false);
            return;
        } else {
            setImageFileUploadError(null);
        }
        setImageFileUrl(data.url);
        setFormData({ ...formData, profilePicture: data.url });
        setUploading(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateUserSuccess(null);
        setUpdateUserError(null);
        if (Object.keys(formData).length === 0) {
            setUpdateUserError("No changes made");
            return;
        }
        try {
            dispatch(updateStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                setUpdateUserError(data.message);
                dispatch(updateFailure(data));
            } else {
                setUpdateUserSuccess("Profile updated successfully");
                dispatch(updateSuccess(data));
            }
        } catch (error) {
            dispatch(updateFailure(error.message));
            setUpdateUserError(error.message);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-3 w-full">
            <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={filePickerRef}
                    hidden
                />
                <div
                    className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
                    onClick={() => filePickerRef.current.click()}
                >
                    <img
                        src={imageFileUrl || currentUser.profilePicture}
                        alt="user"
                        className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
                    />
                </div>
                {imageFileUploadError && (
                    <Alert color="failure">{imageFileUploadError}</Alert>
                )}
                <TextInput
                    type="text"
                    id="username"
                    placeholder="username"
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                />
                <TextInput
                    type="email"
                    id="email"
                    placeholder="email"
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                />
                <TextInput
                    type="password"
                    id="password"
                    placeholder="Password"
                    onChange={handleChange}
                />
                <Button
                    type="submit"
                    gradientDuoTone="purpleToBlue"
                    outline
                    disabled={uploading}
                >
                    {uploading ? (
                        <>
                            <Spinner size="sm" />
                            <span className="pl-3">Uploading Image...</span>
                        </>
                    ) : (
                        "Update"
                    )}
                </Button>
            </form>
            <div className="text-red-500 flex justify-between mt-5">
                <span className="cursor-pointer">Delete Account</span>
                <span className="cursor-pointer">Sign Out</span>
            </div>
            {updateUserSuccess && (
                <Alert color="success" className="mt-5">
                    {updateUserSuccess}
                </Alert>
            )}
            {updateUserError && (
                <Alert color="failure" className="mt-5">
                    {updateUserError}
                </Alert>
            )}
        </div>
    );
}
