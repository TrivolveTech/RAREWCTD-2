import { type ChangeEvent, useState } from "react";
import Button from "../button";
import { useAppStore } from "@/store/app";
import { error } from "@/utils";
import axios from "axios";
import { useAccount } from "wagmi";
import { type Metadata, type InputProps } from "@/types";
import { toast } from "react-toastify";
import CountryDropdown from "./CountryDropdown";
import { allCountries } from "@/utils/allCountries";

const TokenInfo = () => {
  const { address } = useAccount();

  const { mediaFile, setModal } = useAppStore();

  const [loading, setLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState(allCountries[0]);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    mediaType: string;
    image: string;
    ownerName: string;
    ownerAddress: string;
    location: string;
    valuation: string;
    jurisdiction: string;
    complianceCert: string;
  }>({
    name: "",
    description: "",
    mediaType: mediaFile?.type,
    image: mediaFile?.url,
    ownerName: "",
    ownerAddress: address ?? "",
    location: "",
    valuation: "",
    jurisdiction: "",
    complianceCert: "",
  });

  const validateForm = () => {
    return (
      formData.name.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.mediaType?.trim() !== "" &&
      formData.image?.trim() !== "" &&
      formData.ownerName.trim() !== "" &&
      formData.ownerAddress.trim() !== "" &&
      formData.location.trim() !== "" &&
      formData.valuation.trim() !== "" &&
      formData.jurisdiction.trim() !== "" &&
      formData.complianceCert.trim() !== ""
    );
  };

  type FieldName = keyof typeof formData;

  const handleInputChange = (fieldName: FieldName, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };
  type SetterFunction = (
    updateFunction: (prevState: string[]) => string[],
  ) => void;
  const handleCheckboxChange = (
    setter: SetterFunction,
    value: string,
  ): void => {
    setter((prevState) =>
      prevState.includes(value)
        ? prevState.filter((item) => item !== value)
        : [...prevState, value],
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const metadata: Metadata = {
        description: formData.description,
        name: formData.name,
        image: formData.image,
        files: [
          {
            mediaType: formData.mediaType,
            name: formData.name,
          },
        ],
        realWorldAsset: {
          owner: {
            name: formData.ownerName,
            address: address ?? "",
          },
          legalCompliance: {
            complianceCert: formData.complianceCert,
            jurisdiction: formData.jurisdiction,
          },
          physicalAttributes: {
            location: formData.location,
            valuation: "$" + formData.valuation,
          }
        },
        mediaType: formData.mediaType,
      };
      const { data } = await axios.post<{
        [key: string]: unknown; // replace with the actual type define for mintData
        transactionHash: string;
      }>("/api/mintTo", {
        contractAddress: process.env.CONTRACT_ADDRESS,
        toWalletAddress: address,
        metadata,
      });
      // console.log(metadata);
      toast.success("Token minted to your wallet: " + data.transactionHash);
      setLoading(false);
      setModal(null)
    } catch (error: unknown) {
      console.log(error);
      toast.error("Failed !");
      setLoading(false);
    }
  };
  return (
    <div
      className="bg-[#4040406e] text-white relative flex h-[70vh] w-full max-w-[700px] flex-col gap-2 overflow-auto rounded-md p-5 md:h-[80vh]"
      data-lenis-prevent
    >
      <div className="mb-2 w-full text-center text-2xl font-bold">
        {preview ? "Token Preview" : "Token Info"}
      </div>
      <div className="flex flex-col gap-3">
        <TitleAndInput
          value={formData.name}
          title="Name"
          inputPlaceholder="Enter name"
          onChange={(value: string) => handleInputChange("name", value)}
          preview={preview}
        />
        <TitleAndInput
          textArea
          value={formData.description}
          title="Description"
          inputPlaceholder="Enter Description"
          onChange={(value: string) => handleInputChange("description", value)}
          preview={preview}
        />
        <TitleAndInput
          value={formData.ownerName}
          title="Owner Name"
          inputPlaceholder="Enter Owner Name"
          onChange={(value: string) => handleInputChange("ownerName", value)}
        />
        <TitleAndInput
          value={formData.location}
          title="Location"
          inputPlaceholder="Enter Location"
          onChange={(value: string) => handleInputChange("location", value)}
        />
        <TitleAndInput
          value={formData.mediaType}
          title="Media Type"
          inputPlaceholder="Enter Media Type"
          onChange={(value: string) => handleInputChange("mediaType", value)}
          preview={true}
        />
        <TitleAndInput
          value={formData.image}
          title="Media URL"
          inputPlaceholder="Enter URL"
          onChange={(value: string) => handleInputChange("image", value)}
          preview={true}
        />
        <TitleAndInputWithSymbol
          value={formData.valuation}
          title="Valuation"
          symbol="$"
          inputPlaceholder="Enter valuation"
          onChange={(value: string) => handleInputChange("valuation", value)}
        />
        <TitleAndInput
          value={formData.complianceCert}
          title="Compliance Certificate"
          inputPlaceholder="Enter Compliance Certificate"
          onChange={(value: string) => handleInputChange("complianceCert", value)}
        />
        <div className="flex flex-col gap-1 font-inter tracking-wide">
          <h2 className="ml-1 font-semibold text-secondary">
            Jurisdiction
          </h2>
          <CountryDropdown selectedCountry={selectedCountry} setSelectedCountry={(country: string) => {
            handleInputChange("jurisdiction", country);
            setSelectedCountry(country)
          }} />
        </div>
      </div>
      <div className="mt-6 flex w-full items-center justify-between border-t pt-8 ">
        <Button
          className="group relative flex items-center justify-center gap-4 px-6 "
          onClick={() => {
            preview ? setPreview(false) : setModal("UPLOAD");
          }}
        >
          <div className="relative !text-sm text-white group-hover:text-black md:text-base ">
            BACK
          </div>
        </Button>
        {!preview ? (
          <Button
            className="group relative flex items-center justify-center gap-4 px-6 "
            onClick={() => {
              validateForm()
                ? setPreview(true)
                : error("Please fill all input fields.");
            }}
          >
            <div className="relative !text-sm text-white group-hover:text-black md:text-base ">
              NEXT
            </div>
          </Button>
        ) : (
          <Button
            className="group relative flex items-center justify-center gap-4 px-4 md:px-10 "
            onClick={handleSubmit}
          >
            <div className="relative !text-sm text-white group-hover:text-black md:text-base ">
              {loading ? "Loading..." : "Mint Now"}
            </div>
          </Button>
        )}
      </div>
    </div>
  );
};

export default TokenInfo;

function TitleAndInput({
  title,
  inputPlaceholder,
  textArea,
  value,
  onChange,
  preview,
}: InputProps) {
  const [inpVal, setInpVal] = useState<string>(value ?? "");

  const handleOnChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setInpVal(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-1 font-inter tracking-wide">
      <h2 className="ml-1 font-semibold text-secondary">{title ?? "Lorem"}</h2>

      <div className="relative mt-2 font-medium">
        {textArea ? (
          <textarea
            className={`text-black font-ibm-mono w-full resize-none overflow-hidden rounded-lg bg-primary/20 py-3 pl-5 pr-8 text-sm outline-none ${preview ? "cursor-not-allowed" : ""}`}
            placeholder={inputPlaceholder}
            value={inpVal ?? ""}
            rows={4}
            onChange={handleOnChange}
            readOnly={preview}
          />
        ) : (
          <input
            type="text"
            className={`text-black font-ibm-mono w-full rounded-lg bg-primary/20 px-5 py-3 pr-10 text-sm outline-none ${preview ? "cursor-not-allowed" : ""}`}
            placeholder={inputPlaceholder ?? "Lorem ipsum dolor sit amet"}
            value={inpVal ?? ""}
            onChange={handleOnChange}
            readOnly={preview}
            name={title?.toLowerCase()}
          />
        )}
      </div>
    </div>
  );
}
function TitleAndInputWithSymbol({
  title,
  inputPlaceholder,
  textArea,
  value,
  onChange,
  symbol,
  preview,
}: InputProps & { symbol: string }) {
  const [inpVal, setInpVal] = useState<string>(value ?? "");

  const handleOnChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setInpVal(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-1 font-inter tracking-wide">
      <h2 className="ml-1 font-semibold text-secondary">{title ?? "Lorem"}</h2>
      <div className="relative mt-2 font-medium">
        <span className="absolute z-[2] left-3 top-[9px] text-black font-bold">{symbol}</span>
        <input
          type="number"
          className={`text-black font-ibm-mono w-full rounded-lg bg-primary/20 pl-8 pr-5 py-3 pr-10 text-sm outline-none}`}
          placeholder={inputPlaceholder ?? "Lorem ipsum dolor sit amet"}
          value={inpVal ?? ""}
          onChange={handleOnChange}
          name={title?.toLowerCase()}
        />
      </div>
    </div>
  );
}
