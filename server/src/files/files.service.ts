import { Injectable } from '@nestjs/common';
import { Request } from 'express';

type RecipeFilesResult = {
  picture_url?: string;
  stepImages: { index: number; imageUrl: string }[];
};

@Injectable()
export class FilesService {
  buildPublicUrl(req: Request, folder: 'recipes' | 'steps', filename: string) {
    const base = `${req.protocol}://${req.get('host')}`;
    return `${base}/uploads/${folder}/${filename}`;
  }

  mapFilesForRecipe(files: Express.Multer.File[], req: Request) {
    const result: RecipeFilesResult = {
      picture_url: undefined,
      stepImages: [],
    };

    for (const file of files) {
      if (file.fieldname === 'picture_file') {
        result.picture_url = this.buildPublicUrl(req, 'recipes', file.filename);
        continue;
      }

      const match = file.fieldname.match(/^steps\[(\d+)\]\.image_file$/);
      if (!match) continue;

      const index = Number(match[1]);
      const imageUrl = this.buildPublicUrl(req, 'steps', file.filename);

      result.stepImages.push({ index, imageUrl });
    }

    return result;
  }
}
