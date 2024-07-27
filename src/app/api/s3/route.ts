  // import {S3Client,GetObjectCommand,PutObjectCommand} from "@aws-sdk/client-s3";
  // import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
  // import dotenv from "dotenv"
  // dotenv.config();

  // const s3Client = new S3Client({
  //   region:"ap-south-1",
  //   credentials:{
  //     accessKeyId:process.env.ACCESS_KEY!,
  //     secretAccessKey:process.env.SECRET_ACCESS_KEY!,
  //   },
  // })

  // async function GetObjectURL(key:string) { 
  //   const cmd = new GetObjectCommand({
  //     Bucket:"docio-cli",
  //     Key:key,
  //   })
  //   const url = await getSignedUrl(s3Client,cmd)
  //   return url;
  // }

  // async function get() {
  //   console.log("url",await GetObjectURL("/uploads/doc-1721661089739.mdx"));
    
  // }
  // get();

  // async function putObject(fileName:string , contentType:any) {
  //   const cmd = new PutObjectCommand({
  //     Bucket:"docio-cli",
  //     Key:`/uploads/${fileName}`,
  //     ContentType: contentType,
  //   })
  //   const url = await getSignedUrl(s3Client,cmd,{expiresIn:60})
  //   return url
  // }

  // async function put() {
  //   console.log("url",await putObject("filename.mdx","application/json"));
    
  // }
  // put();

  import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
  import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
  import dotenv from "dotenv";
  import fs from "fs";
  import path from "path";
  import { fileURLToPath } from "url";
  
  dotenv.config();
  
  const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.ACCESS_KEY!,
      secretAccessKey: process.env.SECRET_ACCESS_KEY!,
    },
  });
  

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  
  const localDir = path.resolve(__dirname, '../../../../.contentlayer/generated/Doc');
  
  async function uploadFile(filePath: string, fileName: string) {
    const fileContent = fs.readFileSync(filePath);
    const cmd = new PutObjectCommand({
      Bucket: "docio-cli",
      Key: `.contentlayer/generated/Doc/docs_${fileName}`,
      Body: fileContent,
      ContentType: "application/json", 
    });
    await s3Client.send(cmd);
    console.log(`Uploaded: ${fileName}`);
  }
  
  async function uploadDirectory() {
    const files = fs.readdirSync(localDir);
    for (const file of files) {
      const filePath = path.join(localDir, file);
      await uploadFile(filePath, file);
    }
    console.log("All files uploaded.");
  }
  
  uploadDirectory().catch((error) => {
    console.error("Error uploading files:", error);
  });
  