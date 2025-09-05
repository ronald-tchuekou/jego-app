'use client'

import { MAPBOX_MAP_STYLE } from '@/lib/constants'
import env from '@/lib/env/client'
import { cn } from '@/lib/utils'
import { MapPinIcon } from 'lucide-react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useRef, useState } from 'react'

export interface LocationMapProps {
   className?: string
   latitude?: number
   longitude?: number
   onLocationSelect?: (lat: number, lng: number) => void
   height?: string
   zoom?: number
   interactive?: boolean
   showMarker?: boolean
}

const LocationMap = ({
   className,
   latitude,
   longitude,
   onLocationSelect,
   height = '400px',
   zoom = 10,
   interactive = true,
   showMarker = true,
}: LocationMapProps) => {
   const theme = useTheme()
   const mapContainer = useRef<HTMLDivElement>(null)
   const map = useRef<mapboxgl.Map | null>(null)
   const marker = useRef<mapboxgl.Marker | null>(null)
   const [isLoading, setIsLoading] = useState(true)

   // Initialize map
   useEffect(() => {
      if (!mapContainer.current || map.current) return

      mapboxgl.accessToken = env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

      map.current = new mapboxgl.Map({
         container: mapContainer.current,
         style: theme.theme === 'dark' ? MAPBOX_MAP_STYLE.dark : MAPBOX_MAP_STYLE.light,
         center: [longitude || 9.704508529647455, latitude || 4.038541167352562], // Default to Douala
         zoom,
         interactive,
      })

      map.current.on('load', () => {
         setIsLoading(false)
      })

      // Add click handler if interactive
      if (interactive && onLocationSelect) {
         map.current.on('click', (e) => {
            const { lng, lat } = e.lngLat
            onLocationSelect(lat, lng)
         })
      }

      return () => {
         map.current?.remove()
         map.current = null
      }
   }, [theme.theme, zoom, interactive, onLocationSelect, latitude, longitude])

   // Update marker position
   const updateMarker = useCallback(
      (lat: number, lng: number) => {
         if (!map.current) return

         // Remove existing marker
         if (marker.current) {
            marker.current.remove()
         }

         if (showMarker) {
            // Create new marker
            marker.current = new mapboxgl.Marker({
               color: '#ef4444', // red-500
               draggable: interactive,
            })
               .setLngLat([lng, lat])
               .addTo(map.current)

            // Handle marker drag if interactive
            if (interactive && onLocationSelect) {
               marker.current.on('dragend', () => {
                  const lngLat = marker.current!.getLngLat()
                  onLocationSelect(lngLat.lat, lngLat.lng)
               })
            }
         }

         // Center map on the location
         map.current.setCenter([lng, lat])
      },
      [interactive, onLocationSelect, showMarker]
   )

   // Update marker when coordinates change
   useEffect(() => {
      if (latitude !== undefined && longitude !== undefined) {
         updateMarker(latitude, longitude)
      }
   }, [latitude, longitude, updateMarker])

   return (
      <div className={cn('relative rounded-lg overflow-hidden border', className)}>
         {isLoading && (
            <div className='absolute inset-0 flex items-center justify-center bg-muted/50 z-10' style={{ height }}>
               <div className='flex items-center gap-2 text-muted-foreground'>
                  <MapPinIcon className='size-4 animate-pulse' />
                  <span className='text-sm'>Chargement de la carte...</span>
               </div>
            </div>
         )}
         <div ref={mapContainer} className='w-full' style={{ height }} />
         {interactive && (
            <div className='absolute top-2 left-2 bg-card backdrop-blur-sm rounded px-2 py-1 text-xs text-card-foreground shadow-sm'>
               {onLocationSelect ? 'Cliquez pour sélectionner une position' : 'Carte interactive'}
            </div>
         )}
      </div>
   )
}

LocationMap.displayName = 'LocationMap'

export { LocationMap }
