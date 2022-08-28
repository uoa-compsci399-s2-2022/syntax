import { NextApiRequest, NextApiResponse } from "next";
import aws from 'aws-sdk'
import crypto from 'crypto'

const path = `http://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/`

const s3Client = new aws.S3({
    region: process.env.AWS_BUCKET_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    signatureVersion: "v4",
});

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }
  
    try {
        let { type } = req.body;
        const fileName = generateFileName();

        const fileParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Expires: 600,
            ContentType: type,
        };
    
        const url = await s3Client.getSignedUrlPromise("putObject", fileParams);
        const imageUrl = path + fileName;
        
        res.status(200).json({ 
            url: url,
            src: imageUrl,
    });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err });
    }
  };