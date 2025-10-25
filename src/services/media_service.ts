
export type MediaModel = {
   id: string
   userId: string
   name: string
   type: string
   url: string
   size: number
   thumbnailUrl: string | null
   alt: string | null
   metadata: {
      width: number | null
      height: number | null
      duration: number | null
      aspectRatio: string | null
   } | null
}

const MediaService = {
   
}

export default MediaService
