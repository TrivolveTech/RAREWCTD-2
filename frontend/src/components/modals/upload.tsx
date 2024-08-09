import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { GoPlus } from "react-icons/go";
import { useAppStore } from "@/store/app";
import { Loader } from "../loader";
import Image from "next/image";
import { toast } from "react-toastify";

const Upload = () => {
  const { setMediaFile, setModal } = useAppStore();
  const [isFile, setIsFile] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const uploadToIPFS = async (
    fileBase64: string | ArrayBuffer | null,
    fileMimetype: string,
  ) => {
    try {
      setLoading(true);
      const response = await axios.post<{ hash: string }>(
        "/api/uploadToIpfs",
        {
          fileFromBase64: fileBase64,
          mimetype: fileMimetype,
        },
      );
      setLoading(false);
      return response.data.hash;
    } catch (error) {
      console.error("Error uploading to IPFS", error);
      setLoading(false);
      throw error;
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = async () => {
        const base64data = reader.result;
        if (typeof base64data === "string") {
          const base64Data = base64data.split(",")[1];
          try {
            if (base64Data) {
              const imgRes = await uploadToIPFS(base64Data, selectedFile.type);
              setMediaFile(selectedFile.type, "ipfs://" + (imgRes ?? ""));
              setIsFile(true);
            }
          } catch (error) {
            console.error("Error uploading file", error);
          }
        }
      };
      reader.onerror = function (error) {
        console.error("Error reading file: ", error);
      };
    }
  };

  useEffect(() => {
    if (isFile) {
      setModal("TOKEN_INFO");
    }
  }, [isFile]);

  return (
    <div className="bg-[#4040406e] text-white relative flex h-[70vh] w-full max-w-[700px] flex-col gap-2 rounded-md p-5 md:h-[80vh]">
      {loading ? (
        <Loader />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center rounded-md">
          <div
            className="border border-white border-dashed rounded-lg relative flex h-36 w-36 cursor-pointer items-center justify-center hover:bg-primary/20"
            onClick={handleUpload}
          >
            <Image className="absolute" width={40} height={40} loader={({ src }) => src} src="https://cdn-icons-png.flaticon.com/512/8202/8202904.png" alt="Drag And Drop" />
            <input
              type="file"
              ref={fileInputRef}
              className=" invisible"
              onChange={handleFileChange}
            />
          </div>
          <div className="mt-6 text-center">
            <h1 className="text-xl font-bold">Drag & Drop</h1>
            <span className="mt-1 text-lg">Your file here or browse</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
