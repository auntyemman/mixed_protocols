// import {
//   Injectable,
//   PipeTransform,
//   ArgumentMetadata,
//   HttpStatus,
//   BadRequestException,
// } from '@nestjs/common';
// import { Multer } from 'multer';
// // import { mimetype } from 'mime-types'; // Optional dependency for MIME type lookup

// // interface AllowedMimeTypes {
// //   [key: string]: string[]; // Key is the field name, value is an array of allowed MIME types
// // }

// @Injectable()
// export class FileValidationPipe implements PipeTransform {
//   private readonly allowedMimeTypes = {
//     avatar: ['image/jpeg', 'image/png', 'text/plain'],
//   };
//   private readonly allowedFileSizes = {
//     avatar: 1024 * 5,
//   };
//   constructor() {}

//   transform(
//     value: { [key: string]: Express.Multer.File[] },
//     metadata: ArgumentMetadata,
//   ) {
//     const files = value;

//     for (const [fieldName, fieldFiles] of Object.entries(files)) {
//       if (!fieldFiles) {
//         continue; // Skip if field doesn't have uploaded files
//       }

//       const allowedTypes = this.allowedMimeTypes[fieldName] || [];

//       for (const file of fieldFiles) {
//         console.log('fileee', file);
//         //const fileType = mimetype(file.originalname); // Use mime-types package (optional)
//         //const fileType = file.mimetype;
//         if (!file.mimetype || !allowedTypes.includes(file.mimetype)) {
//           throw new BadRequestException(
//             `Invalid file type for ${this.allowedMimeTypes[fieldName]}`,
//           );
//         }
//         if (file.size > this.allowedFileSizes[fieldName]) {
//           throw new BadRequestException(
//             `File size exceeds the limit for ${file.fieldname}`,
//           );
//         }
//       }
//       console.log('valueee', value);
//       return value;
//     }
//   }
// }
