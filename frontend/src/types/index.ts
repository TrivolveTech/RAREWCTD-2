export interface Metadata {
  name: string;
  description: string;
  image: string;
  mediaType: string;
  realWorldAsset: RealWorldAsset;
  files: {
    name: string;
    mediaType: string;
  }[];
}
interface RealWorldAsset {
  owner: {
    name: string;
    address: string;
  };
  physicalAttributes: {
    location: string;
    valuation: string;
  };
  legalCompliance: {
    jurisdiction: string;
    complianceCert: string;
  };
}
export interface InputProps {
  title?: string;
  inputPlaceholder?: string;
  textArea?: boolean;
  value?: string | null;
  onChange: (value: string) => void;
  preview?: boolean;
}
