import { NextApiRequest, NextApiResponse } from "next";
import aws from 'aws-sdk'
import { resolve } from "path";
import { getSession } from "next-auth/react";
import rateLimit from "../../../utils/rate-limit"

//Set up S3 client with configurations
const s3Client = new aws.S3({
    region: process.env.AWS_BUCKET_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    signatureVersion: "v4",
    apiVersion: '2006-03-01',
});

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({req})
  console.log(session)
  if (session){
    try{
      await limiter.check(res, 100, 'CACHE_TOKEN')
    } catch {
      res.status(429).json({error: "Rate limit exceeded"})
    }
    const { objectKey } = req.query
    if (req.method === "GET") {
      try{
          const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: (typeof objectKey === "string") ? objectKey : objectKey[0],
          };
          const request = await s3Client.getObject(params, function(err, data) {
            if (err) {
              res.status(400).json({
                message: err,
                errorStack: err.stack
              })
            }else {
              const json = JSON.parse(data.Body.toString())
              res.status(200).json({
                file: json
              });
            }
          })
      } catch (err) {
          res.status(400).json({ message: err});
      }
    }
    else if (req.method === "PATCH") {
        try{
          const body = JSON.parse(req.body)
          const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: (typeof objectKey === "string") ? objectKey : objectKey[0],
            Tagging: {
              TagSet: [{
                Key: body.tag.key,
                Value: body.tag.value,
              }]
            }
          };
          const request = await s3Client.putObjectTagging(params);
          const response = await request.send();
          res.status(204).json({});
        } catch (err) {
          console.log(err);
          res.status(400).json({ message: err });
        }
    }
    else if (req.method === "DELETE") {
      console.log(objectKey)
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME, 
        Key: (typeof objectKey === "string") ? objectKey : objectKey[0]
      };
      const data = await s3Client.deleteObject(params, function(err, data) {
        if (err) {
          res.status(400).json({
            message: err,
            errorStack: err.stack
          })
        }else {
          res.status(200).json({
            file: data
          });
        }});
    } else{
        return res.status(405).json({ message: "Method not allowed" });
    }    
  } else {
    return res.status(401).json({message: "Unauthorized access"})
  }
}