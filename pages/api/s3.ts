import { NextApiRequest, NextApiResponse } from "next";
import aws from 'aws-sdk'
import crypto from 'crypto'
import { getSession } from "next-auth/react";
import rateLimit from "../../utils/rate-limit"

//File path of image location
const path = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/`

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

const limiter = rateLimit({
  interval: 1000, //resets token every second
  uniqueTokenPerInterval: 500, //500 unique users per call
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({req})
  if (session){
    try{
      await limiter.check(res, 2, 'CACHE_TOKEN') //2 requests per second is the limit
    } catch {
      return res.status(429).json({error: 'Rate limit exceeded'}) 
    }
    if (req.method === "POST") {
      try {
        let type = req.body;
        const fileName = generateFileName();
        let fileParams: object
        if (type === "drawing"){
          fileParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Expires: 90, 
            Conditions: [
              ['starts-with', '$key', fileName],
              ['content-length-range', 0, sizeLimit], //file limitation
            ],
          }
        } else {
          fileParams = {
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
        }
  
        const data = await s3Client.createPresignedPost(fileParams);
        const imageUrl = path + fileName;
        //return data for presigned post url and image location url
        return res.status(200).json({ 
            data: data, 
            src: imageUrl,
            key: fileName
      });
      } catch (err) {
        console.log(err);
        return res.status(400).json({ message: err });
      }
    }
    else{
      return res.status(405).json({ message: "Method not allowed" });
    }
  } else {
    return res.status(401).json({message: "Unauthorized access"})
  }
};