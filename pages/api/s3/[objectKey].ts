import { NextApiRequest, NextApiResponse } from "next";
import aws from 'aws-sdk'
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
  interval: 1000, //resets token every second
  uniqueTokenPerInterval: 500 //500 unique users per call
})

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({req})
  if (session){
    try{
			await limiter.check(res, 2, 'CACHE_TOKEN') //2 requests per second is the limit
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
              return res.status(400).json({
                message: err,
                errorStack: err.stack
              })
            }else {
              const json = JSON.parse(data.Body.toString())
              return res.status(200).json({
                file: json //returns json file of the file requested
              });
            }
          })
      } catch (err) {
          return res.status(400).json({ message: err});
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
          //updates or adds the tag {Key: key, Value: value}
          const request = await s3Client.putObjectTagging(params);
          const response = await request.send();
          return res.status(204).json({});
        } catch (err) {
          console.log(err);
          return res.status(400).json({ message: err });
        }
    }
    else if (req.method === "DELETE") {
      console.log(objectKey)
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME, 
        Key: (typeof objectKey === "string") ? objectKey : objectKey[0]
      };
      //deletes object with the key [objectkey]
      const data = await s3Client.deleteObject(params, function(err, data) {
        if (err) {
          return res.status(400).json({
            message: err,
            errorStack: err.stack
          })
        }else {
          return res.status(200).json({
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