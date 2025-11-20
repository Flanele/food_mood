import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  exports: [FilesService],
  imports: [SupabaseModule],
  providers: [FilesService],
})
export class FilesModule {}
