import { sdkConnect } from "@/utils/sdk.connect";
import { network, private_key, thirdweb_secretkey } from "@/utils/config";
import type { NextApiRequest, NextApiResponse } from "next";

interface RealWorldAsset {
  owner: {
    name: string;
    address: string;
  };
  physicalAttributes: {
    Location: string;
    Valuation: string;
  };
  legalCompliance: {
    jurisdiction: string;
    complianceCert: string;
  };
}

interface Metadata {
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

interface RequestBody {
  contractAddress: string;
  toWalletAddress: string;
  metadata: Metadata;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data: RequestBody = req.body;
    const sdk = sdkConnect(private_key, network, thirdweb_secretkey);
    if (!sdk)
      throw {
        status: 400,
        message: "Unable to connect the sdk, please verify credentials",
      };
    const nft = await sdk.getNFTCollection(data.contractAddress);
    const mint = await nft.mintTo(data.toWalletAddress, data.metadata);

    const mintData = await mint.data();

    console.log(`NFT minted to wallet`);
    res
      .status(201)
      .json({ ...mintData, transactionHash: mint.receipt.transactionHash });
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message } || err);
  }
}
