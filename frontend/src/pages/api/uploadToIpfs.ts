import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const NMKR_CUSTOMER_ID = process.env.NMKR_CUSTOMER_ID;
const NMKR_API_KEY = process.env.NMKR_API_KEY;

interface RequestBody {
  fileFromBase64: string;
  mimetype: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { fileFromBase64, mimetype }: RequestBody = req.body;
    console.log(fileFromBase64, mimetype);
    if (!fileFromBase64 || !mimetype) {
      throw {
        status: 400,
        message: "Invalid Request , No Url or mimetype found ",
      };
    }

    const { data } = await axios.post(
      `https://studio-api.nmkr.io/v2/UploadToIpfs/${NMKR_CUSTOMER_ID}`,
      {
        mimetype: mimetype,
        fileFromBase64: fileFromBase64,
      },
      {
        headers: {
          Authorization: `Bearer ${NMKR_API_KEY}`,
        },
      }
    );

    res.json({ hash: data });
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message } || error);
  }
}
