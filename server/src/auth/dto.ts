import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';

export enum Provider {
  Credentials = 'credentials',
  Google = 'google',
}

export class SignUpBodyDTO {
  @ApiProperty({ example: 'credentials' })
  @IsEnum(Provider)
  provider: Provider;

  @ApiProperty({ example: 'user@gmail.com', required: false })
  @ValidateIf((o) => o.provider === Provider.Credentials)
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'qwerty', required: false })
  @ValidateIf((o) => o.provider === Provider.Credentials)
  @IsString()
  @IsNotEmpty()
  password?: string;

  @ApiProperty({ required: false, description: 'Google ID tocken (JWT)' })
  @ValidateIf((o) => o.provider === Provider.Google)
  @IsString()
  @IsNotEmpty()
  idToken?: string;
}

export class SignInBodyDTO {
  @ApiProperty({ example: 'credentials' })
  @IsEnum(Provider)
  provider: Provider;

  @ApiProperty({ example: 'user@gmail.com', required: false })
  @ValidateIf((o) => o.provider === Provider.Credentials)
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'qwerty', required: false })
  @ValidateIf((o) => o.provider === Provider.Credentials)
  @IsString()
  @IsNotEmpty()
  password?: string;

  @ApiProperty({ required: false, description: 'Google ID tocken (JWT)' })
  @ValidateIf((o) => o.provider === Provider.Google)
  @IsString()
  @IsNotEmpty()
  idToken?: string;
}

export class GetSessionInfoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  'iat': number;

  @ApiProperty()
  'exp': number;
}

export class AccessTokenDto {
  @ApiProperty()
  accessToken: string;
}
