import { Alert, Button, Modal, Spinner, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
    updateStart,
    updateSuccess,
    updateFailure,
    deleteStart,
    deleteSuccess,
    deleteFailure,
    signoutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";

export default function DashProfile() {
    const { currentUser, error } = useSelector((state) => state.user);
    const { theme } = useSelector((state) => state.theme);
    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
    const [updateUserError, setUpdateUserError] = useState(null);
    const [showModal, setShowModal] = useState(false);
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

    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            dispatch(deleteStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) {
                dispatch(deleteFailure(data.message));
            } else {
                dispatch(deleteSuccess(data));
            }
        } catch (error) {
            dispatch(deleteFailure(error.message));
        }
    };

    const handleSignOut = async () => {
        try {
            const res = await fetch("/api/user/signout", {
                method: "POST",
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(error);
            } else {
                dispatch(signoutSuccess());
            }
        } catch (error) {
            console.log(error.message);
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
                {currentUser.isAdmin && (
                    <Link to={"/create-post"}>
                        <Button
                            type="button"
                            gradientDuoTone="purpleToPink"
                            className="w-full"
                        >
                            Create a post
                        </Button>
                    </Link>
                )}
            </form>
            <div className="text-red-500 flex justify-between mt-5">
                <span
                    onClick={() => setShowModal(true)}
                    className="cursor-pointer"
                >
                    Delete Account
                </span>
                <span onClick={handleSignOut} className="cursor-pointer">
                    Sign Out
                </span>
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
            {error && (
                <Alert color="failure" className="mt-5">
                    {error}
                </Alert>
            )}
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size="md"
                className={`bg-gray-900/50 dark:bg-gray-900/80 ${
                    theme === "light" ? "light" : "dark"
                }`}
            >
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                        <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete your account?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={handleDeleteUser}>
                                Yes, I'm sure
                            </Button>
                            <Button
                                color="gray"
                                onClick={() => setShowModal(false)}
                            >
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}
