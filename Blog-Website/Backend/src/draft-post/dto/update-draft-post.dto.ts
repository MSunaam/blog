import { PartialType } from '@nestjs/mapped-types';
import { CreateDraftPostDto } from './create-draft-post.dto';

export class UpdateDraftPostDto extends PartialType(CreateDraftPostDto) {}
