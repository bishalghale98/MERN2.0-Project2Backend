import { Request } from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    const uploadPath = path.join(__dirname, "../uploads");
    cb(null, uploadPath);
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const allowedFileTypes = ["image/jpg", "image/jpeg", "image/png"];
  if (!allowedFileTypes.includes(file.mimetype)) {
    return cb(new Error("This filetype is not accepted"));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

export { upload };
