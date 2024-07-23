import { SetMetadata } from '@nestjs/common';

export const Attributes = (...attributes: Record<string, any>[]) =>
  SetMetadata('attributes', attributes);
