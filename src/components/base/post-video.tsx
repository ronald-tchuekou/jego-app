import { Button } from '@/components/ui/button'
import env from '@/lib/env/client'
import { cn, formatDuration, getAspectRatioClass } from '@/lib/utils'
import { MediaModel } from '@/services/media_service'
import { LoaderIcon, MaximizeIcon, MinimizeIcon, PauseIcon, PlayIcon, Volume2Icon, VolumeXIcon } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

type Props = {
   videoPaths: MediaModel[]
}

function PostVideo({ videoPaths }: Props) {
   const videoRef = useRef<HTMLVideoElement>(null)
   const containerRef = useRef<HTMLDivElement>(null)
   const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

   const [isPlaying, setIsPlaying] = useState(false)
   const [isMuted, setIsMuted] = useState(true)
   const [showVideo, setShowVideo] = useState(false)
   const [isLoading, setIsLoading] = useState(false)
   const [currentTime, setCurrentTime] = useState(0)
   const [durationSec, setDurationSec] = useState(0)
   const [showControls, setShowControls] = useState(true)
   const [isFullscreen, setIsFullscreen] = useState(false)

   const video = videoPaths[0]
   const videoMetadata = video.metadata as MediaModel['metadata']
   const videoUrl = video.url.startsWith('http') ? video.url : `${env.NEXT_PUBLIC_API_URL}/v1/${video.url}`

   // Extract video metadata
   const aspectRatio = videoMetadata?.aspectRatio || '16:9'

   // Auto-hide controls after 3 seconds of inactivity when playing
   const resetControlsTimeout = useCallback(() => {
      if (controlsTimeoutRef.current) {
         clearTimeout(controlsTimeoutRef.current)
      }

      setShowControls(true)

      if (isPlaying) {
         controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false)
         }, 3000)
      }
   }, [isPlaying])

   // Show controls on interaction
   const handleInteraction = useCallback(() => {
      resetControlsTimeout()
   }, [resetControlsTimeout])

   // Handle fullscreen changes
   useEffect(() => {
      const handleFullscreenChange = () => {
         setIsFullscreen(!!document.fullscreenElement)
      }

      document.addEventListener('fullscreenchange', handleFullscreenChange)
      return () => {
         document.removeEventListener('fullscreenchange', handleFullscreenChange)
         if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current)
         }
      }
   }, [])

   // Reset controls timeout when playing state changes
   useEffect(() => {
      resetControlsTimeout()
   }, [isPlaying])

   const handlePlayPause = async () => {
      if (!videoRef.current) return

      setIsLoading(true)

      try {
         if (isPlaying) {
            videoRef.current.pause()
            setIsPlaying(false)
         } else {
            if (!showVideo) {
               setShowVideo(true)
               // Simulate loading time
               await new Promise((resolve) => setTimeout(resolve, 500))
            }
            await videoRef.current.play()
            setIsPlaying(true)
         }
      } catch (error) {
         console.error('Video playback error:', error)
         toast.error('Unable to play video')
      } finally {
         setIsLoading(false)
      }
   }

   const handleMuteToggle = () => {
      if (videoRef.current) {
         videoRef.current.muted = !isMuted
         setIsMuted(!isMuted)
      }
   }

   const handleFullscreen = async () => {
      if (!containerRef.current) return

      try {
         if (!document.fullscreenElement) {
            await containerRef.current.requestFullscreen()
         } else {
            await document.exitFullscreen()
         }
      } catch (error) {
         console.error('Fullscreen error:', error)
         toast.error('Unable to toggle fullscreen')
      }
   }

   // Handle video container click/tap (toggle play/pause on mobile)
   const handleVideoClick = (e: React.MouseEvent) => {
      // Don't trigger if clicking on controls
      if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) {
         return
      }
      handlePlayPause()
   }

   return (
      <div
         ref={containerRef}
         className={cn(
            'relative bg-gray-300 dark:bg-gray-600 overflow-hidden group border rounded-lg cursor-pointer',
            getAspectRatioClass(aspectRatio)
         )}
         onClick={handleVideoClick}
         onMouseMove={handleInteraction}
         onTouchStart={handleInteraction}
         role='region'
         aria-label='Video player'
      >
         {/* Video Thumbnail */}
         {!showVideo && video.thumbnailUrl && (
            <Image
               width={100}
               height={100}
               src={video.thumbnailUrl}
               alt='Video thumbnail'
               className='absolute inset-0 w-full h-full object-cover object-center'
            />
         )}

         {/* Video Element */}
         <video
            ref={videoRef}
            src={videoUrl}
            className='absolute inset-0 w-full object-cover'
            muted={isMuted}
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onLoadStart={() => setIsLoading(true)}
            onCanPlay={() => setIsLoading(false)}
            onLoadedMetadata={() => setDurationSec(Math.round(videoRef.current?.duration || 0))}
            onDurationChange={() => setDurationSec(Math.round(videoRef.current?.duration || 0))}
            onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
            aria-label='Video content'
         />

         {/* Loading Overlay */}
         {isLoading && (
            <div className='absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none z-10'>
               <div className='bg-background/90 rounded-full p-4'>
                  <LoaderIcon className='w-8 h-8 animate-spin text-foreground' />
               </div>
            </div>
         )}

         {/* Video Controls Overlay */}
         <div
            className={cn(
               'absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 transition-opacity duration-300',
               showControls ? 'opacity-100' : 'opacity-0'
            )}
            style={{ pointerEvents: showControls ? 'auto' : 'none' }}
         >
            {/* Play/Pause Button - Center */}
            <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
               <Button
                  onClick={(e) => {
                     e.stopPropagation()
                     handlePlayPause()
                  }}
                  disabled={isLoading}
                  size='lg'
                  className={cn(
                     'rounded-full bg-background/90 hover:bg-background text-foreground shadow-lg backdrop-blur-sm transition-all duration-200 pointer-events-auto',
                     'w-14 h-14 sm:w-16 sm:h-16',
                     !showControls && 'opacity-0'
                  )}
                  aria-label={isPlaying ? 'Pause video' : 'Play video'}
               >
                  {isLoading ? (
                     <LoaderIcon className={cn('animate-spin', 'w-6 h-6 sm:w-8 sm:h-8')} />
                  ) : isPlaying ? (
                     <PauseIcon className={cn('w-6 h-6 sm:w-8 sm:h-8')} />
                  ) : (
                     <PlayIcon className={cn('ml-1', 'w-6 h-6 sm:w-8 sm:h-8')} />
                  )}
               </Button>
            </div>

            {/* Bottom Controls */}
            <div className='absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 flex items-center gap-1 sm:gap-2'>
               {/* Left: Mute */}
               <Button
                  onClick={(e) => {
                     e.stopPropagation()
                     handleMuteToggle()
                  }}
                  size='sm'
                  variant='ghost'
                  className='text-white hover:bg-white/20 backdrop-blur-sm h-8 w-8 sm:h-10 sm:w-10 p-0 shrink-0'
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
               >
                  {isMuted ? (
                     <VolumeXIcon className='w-4 h-4 sm:w-5 sm:h-5' />
                  ) : (
                     <Volume2Icon className='w-4 h-4 sm:w-5 sm:h-5' />
                  )}
               </Button>

               {/* Middle: Progress Bar */}
               <div className='flex-1 flex items-center gap-1 sm:gap-2 min-w-0'>
                  <span className='text-white/90 text-[10px] sm:text-xs hidden sm:block w-8 sm:w-10 text-right shrink-0'>
                     {formatDuration(Math.round(currentTime))}
                  </span>
                  <input
                     type='range'
                     min={0}
                     max={Math.max(durationSec, 0.1)}
                     step={0.1}
                     value={currentTime}
                     onChange={(e) => {
                        e.stopPropagation()
                        if (!videoRef.current) return
                        const value = Number(e.currentTarget.value)
                        videoRef.current.currentTime = value
                        setCurrentTime(value)
                     }}
                     onClick={(e) => e.stopPropagation()}
                     className='w-full h-1 sm:h-1.5 cursor-pointer accent-white'
                     aria-label='Video progress'
                     aria-valuemin={0}
                     aria-valuemax={durationSec}
                     aria-valuenow={currentTime}
                  />
                  <span className='text-white/90 text-[10px] sm:text-xs w-8 sm:w-10 shrink-0'>
                     {formatDuration(durationSec)}
                  </span>
               </div>

               {/* Right: Fullscreen */}
               <Button
                  onClick={(e) => {
                     e.stopPropagation()
                     handleFullscreen()
                  }}
                  size='sm'
                  variant='ghost'
                  className='text-white hover:bg-white/20 backdrop-blur-sm h-8 w-8 sm:h-10 sm:w-10 p-0 shrink-0'
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
               >
                  {isFullscreen ? (
                     <MinimizeIcon className='w-4 h-4 sm:w-5 sm:h-5' />
                  ) : (
                     <MaximizeIcon className='w-4 h-4 sm:w-5 sm:h-5' />
                  )}
               </Button>
            </div>
         </div>
      </div>
   )
}

export default PostVideo
