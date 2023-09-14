import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class ImageValidationPipe implements PipeTransform<any> {
  private readonly allowedExtensions = ['.jpeg', '.jpg', '.png', '.gif', '.mp4'];
  transform(value: any) {
    try {
      if (value) {
        const file = value?.originalname;
        const fileExtension = extname(file).toLowerCase();
        if (!this.allowedExtensions.includes(fileExtension)) {
          throw new BadRequestException(
            'Only JPEG, JPG, PNG, GIF and MP4 files are allowed.',
          );
        }
        return value;
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
