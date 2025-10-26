export enum FileType {
   IMAGE = 'image',
   VIDEO = 'video',
}

export type UploadedFile = {
   name: string
   url: string
   type: string
   size: number
   metadata?: {
      width: number
      height: number
      duration?: number
      aspectRatio: string
   }
}
