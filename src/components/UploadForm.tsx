"use client";
import {useState, useCallback, Fragment, useEffect} from "react";
import {useDropzone} from "react-dropzone";
import axios from "axios";
import {FaPlusCircle} from "react-icons/fa";
import {Dialog, Transition} from "@headlessui/react";
import Cookie from "js-cookie";

interface UploadProgress {
  status: "idle" | "uploading" | "processing" | "completed" | "error";
  progress: number;
  publicId?: string;
  error?: string;
}

export default function UploadForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);

  const [metadata, setMetadata] = useState({
    title: "",
    description: "",
    isPublic: true,
  });
  const [upload, setUpload] = useState<UploadProgress>({
    status: "idle",
    progress: 0,
  });

  useEffect(() => {
    setToken(Cookie.get("token"));
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUpload({status: "uploading", progress: 0});

      try {
        // Get signature with metadata
        const {
          data: {signature, timestamp, api_key},
        } = await axios.post(
          "https://clipwave-backend-fue2eyddgwd8akbw.uksouth-01.azurewebsites.net/cloudinary/signature",
          {
            title: metadata.title,
            description: metadata.description,
          }
        );

        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
        );
        formData.append("api_key", api_key);
        formData.append("timestamp", timestamp.toString());
        formData.append("signature", signature);
        formData.append(
          "context",
          `title=${metadata.title}|description=${metadata.description}`
        );

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
          formData,
          {
            onUploadProgress: (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1)
              );
              setUpload((prev) => ({...prev, progress}));
            },
          }
        );

        // Save to your database
        await axios.post(
          "https://clipwave-backend-fue2eyddgwd8akbw.uksouth-01.azurewebsites.net/users/videos/upload",
          {
            cloudinaryId: response.data.public_id,
            title: metadata.title,
            description: metadata.description,
            duration: response.data.duration,
            format: response.data.format,
            url: response.data.secure_url,
          },
          {headers: {Authorization: `Bearer ${token}`}}
        );

        setUpload({
          status: "completed",
          progress: 100,
          publicId: response.data.public_id,
        });
      } catch (error: any) {
        console.error("Upload error:", error);
        setUpload({
          status: "error",
          progress: 0,
          error: error.response?.data?.message || "Upload failed",
        });
      }
    },
    [metadata, token]
  );

  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    accept: {"video/*": [".mp4", ".mov", ".avi"]},
    maxSize: 500 * 1024 * 1024,
  });

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-full hover:bg-gray-700 cursor-pointer"
      >
        <FaPlusCircle size={20} />
      </button>

      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
        >
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" />
          </Transition.Child>

          {/* Modal Panel */}
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-bold">
                    Upload Video
                  </Dialog.Title>

                  <div className="space-y-4 mt-4">
                    {/* Dropzone */}
                    <div
                      {...getRootProps()}
                      className="border-2 border-dashed p-8 text-center cursor-pointer"
                    >
                      <input {...getInputProps()} />
                      <p>Drag & drop video or click to browse</p>
                    </div>

                    {/* Title */}
                    {/* <input
                      type="text"
                      placeholder="Title"
                      value={metadata.title}
                      onChange={(e) =>
                        setMetadata({...metadata, title: e.target.value})
                      }
                      className="w-full p-2 border rounded"
                    /> */}

                    {/* Upload Progress */}
                    {upload.status === "uploading" && (
                      <div className="w-full bg-gray-200 rounded-full">
                        <div
                          className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                          style={{width: `${upload.progress}%`}}
                        >
                          {upload.progress}%
                        </div>
                      </div>
                    )}

                    {upload.status === "completed" && (
                      <div className="p-4 bg-green-100 text-green-800 rounded">
                        Upload complete! Video is being processed.
                      </div>
                    )}

                    {upload.status === "error" && (
                      <div className="p-4 bg-red-100 text-red-800 rounded">
                        Error: {upload.error}
                      </div>
                    )}

                    {/* Close Button */}
                    <div className="flex justify-end gap-2 pt-4">
                      <button
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
