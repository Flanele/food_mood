import { diskStorage } from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';

export const imageStorage = diskStorage({
  destination: (req, file, cb) => {
    const isStep = /^steps\[\d+\]\.image_file$/.test(file.fieldname);
    const folder = isStep ? 'steps' : 'recipes';
    cb(null, path.join(process.cwd(), 'public', 'uploads', folder));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${Date.now()}-${randomUUID()}${ext}`);
  },
});
