import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: "dozsvit0z",
  api_key: "579552349817286",
  api_secret: "KzMYvEjhLkUrOGsyieJ9h9j__Po",
});

export default cloudinary;