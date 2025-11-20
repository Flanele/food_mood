import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import { SupabaseService } from 'src/supabase/supabase.service';

type RecipeFilesResult = {
  picture_url?: string;
  stepImages: { index: number; imageUrl: string }[];
};

@Injectable()
export class FilesService {
  private bucket = process.env.SUPABASE_STORAGE_BUCKET ?? 'recipes_assets';

  constructor(private supabaseService: SupabaseService) {}

  private async uploadToSupabase(
    file: Express.Multer.File,
    folder: 'recipes' | 'steps',
  ): Promise<string> {
    const supabase = this.supabaseService.getClient();

    const ext =
      (file.originalname.split('.').pop() &&
        `.${file.originalname.split('.').pop()}`) ||
      '.jpg';

    const filename = `${Date.now()}-${randomUUID()}${ext}`;
    const path = `${folder}/${filename}`;

    const { data, error } = await supabase.storage
      .from(this.bucket)
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.log(error);
      throw new BadRequestException('File upload failed');
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(this.bucket).getPublicUrl(data.path);

    return publicUrl;
  }

  async mapFilesForRecipe(
    files: Express.Multer.File[],
    req: Request,
  ): Promise<RecipeFilesResult> {
    const result: RecipeFilesResult = {
      picture_url: undefined,
      stepImages: [],
    };

    for (const file of files) {
      if (file.fieldname === 'picture_file') {
        const url = await this.uploadToSupabase(file, 'recipes');
        result.picture_url = url;
        continue;
      }

      const match = file.fieldname.match(/^steps\[(\d+)\]\.image_file$/);
      if (!match) continue;

      const index = Number(match[1]);
      const url = await this.uploadToSupabase(file, 'steps');

      result.stepImages.push({ index, imageUrl: url });
    }

    return result;
  }
}
