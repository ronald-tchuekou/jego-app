import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { CompanyModel } from '@/services/company-service'
import {
   IconBrandInstagram,
   IconBrandLinkedin,
   IconBrandTiktok,
   IconBrandX,
   IconBrandYoutube,
} from '@tabler/icons-react'
import { LinkIcon } from 'lucide-react'
import Link from 'next/link'

type Props = {
   company: CompanyModel
}

const SocialLinks = ({ company }: Props) => {
   const { website, facebook, instagram, twitter, linkedin, youtube, tiktok } = company

   return (
      <div className='flex gap-3'>
         {website && (
            <Tooltip>
               <TooltipTrigger asChild>
                  <Button variant='outline' size='icon' asChild>
                     <Link href={website}>
                        <LinkIcon />
                     </Link>
                  </Button>
               </TooltipTrigger>
               <TooltipContent>
                  <p>Site web</p>
               </TooltipContent>
            </Tooltip>
         )}
         {facebook && (
            <Tooltip>
               <TooltipTrigger asChild>
                  <Button variant='outline' size='icon' asChild>
                     <Link href={facebook}>
                        <svg
                           role='img'
                           viewBox='0 0 24 24'
                           xmlns='http://www.w3.org/2000/svg'
                           className='stroke-current fill-current'
                        >
                           <title>Facebook</title>
                           <path d='M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z' />
                        </svg>
                     </Link>
                  </Button>
               </TooltipTrigger>
               <TooltipContent>
                  <p>Facebook</p>
               </TooltipContent>
            </Tooltip>
         )}
         {instagram && (
            <Tooltip>
               <TooltipTrigger asChild>
                  <Button variant='outline' size='icon' asChild>
                     <Link href={instagram}>
                        <IconBrandInstagram className='size-6' />
                     </Link>
                  </Button>
               </TooltipTrigger>
               <TooltipContent>
                  <p>Instagram</p>
               </TooltipContent>
            </Tooltip>
         )}
         {twitter && (
            <Tooltip>
               <TooltipTrigger asChild>
                  <Button variant='outline' size='icon' asChild>
                     <Link href={twitter}>
                        <IconBrandX className='size-5' />
                     </Link>
                  </Button>
               </TooltipTrigger>
               <TooltipContent>
                  <p>Twitter</p>
               </TooltipContent>
            </Tooltip>
         )}
         {linkedin && (
            <Tooltip>
               <TooltipTrigger asChild>
                  <Button variant='outline' size='icon' asChild>
                     <Link href={linkedin || ''}>
                        <IconBrandLinkedin className='size-[1.4rem]' />
                     </Link>
                  </Button>
               </TooltipTrigger>
               <TooltipContent>
                  <p>LinkedIn</p>
               </TooltipContent>
            </Tooltip>
         )}
         {youtube && (
            <Tooltip>
               <TooltipTrigger asChild>
                  <Button variant='outline' size='icon' asChild>
                     <Link href={youtube || ''}>
                        <IconBrandYoutube className='size-5' />
                     </Link>
                  </Button>
               </TooltipTrigger>
               <TooltipContent>
                  <p>YouTube</p>
               </TooltipContent>
            </Tooltip>
         )}
         {tiktok && (
            <Tooltip>
               <TooltipTrigger asChild>
                  <Button variant='outline' size='icon' asChild>
                     <Link href={tiktok || ''}>
                        <IconBrandTiktok className='size-5' />
                     </Link>
                  </Button>
               </TooltipTrigger>
               <TooltipContent>
                  <p>TikTok</p>
               </TooltipContent>
            </Tooltip>
         )}
      </div>
   )
}

export default SocialLinks
