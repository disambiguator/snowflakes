import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { airtablePut, Model } from "../../airtableApi";
import type { NextApiRequest, NextApiResponse } from "next";

const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  },
});

export default async function handler(
  req: NextApiRequest & { query: Model },
  res: NextApiResponse
) {
  airtablePut({ file: req.query.file, name: req.query.name });

  const post = await createPresignedPost(s3Client, {
    Bucket: process.env.BUCKET_NAME!,
    Key: req.query.file,
    Fields: {
      acl: "public-read",
      "Content-Type": "image/png",
    },
    Expires: 600, // seconds
    Conditions: [
      ["content-length-range", 0, 1048576], // up to 1 MB
    ],
  });

  res.status(200).json(post);
}
