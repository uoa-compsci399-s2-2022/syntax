import { NextApiRequest, NextApiResponse } from "next";
import aws from 'aws-sdk'
import crypto from 'crypto'


//File path of image location
const path = `http://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/`

//Set up S3 client with configurations
const s3Client = new aws.S3({
    region: process.env.AWS_BUCKET_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    signatureVersion: "v4",
    apiVersion: '2006-03-01',
});

//Image file size limitation
const sizeLimit = 5242880 

//File name generator to prevent duplicates
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }
  
    try {
        let type = req.body;
        console.log(type)
        const fileName = generateFileName();

        const fileParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Fields: {
              key: fileName, //filename
              'Content-Type':type, //filetype
            },
            Expires: 60, 
            Conditions: [
              ['content-length-range', 0, sizeLimit], //file limitation
            ],
        };
    
        const data = await s3Client.createPresignedPost(fileParams);
        const imageUrl = path + fileName;
        console.log(data)
        //return data for presigned post url and image location url
        res.status(200).json({ 
            data: data,
            src: imageUrl,
    });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err });
    }
  };