import { LoaderIcon } from 'lucide-react'

type Props = {
   text?: string
}

const LoaderContent = ({ text }: Props) => {
   return (
      <div className='w-full min-h-[400px] flex items-center justify-center'>
         <LoaderIcon className='animate-spin text-primary size-10' />
         <span className='ml-2 text-muted-foreground'>{text || 'Chargement...'}</span>
      </div>
   )
}

export default LoaderContent
