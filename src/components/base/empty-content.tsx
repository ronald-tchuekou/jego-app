import { CloudSnowIcon } from "lucide-react"
import { ReactNode } from "react"

type Props = {
	actionContent?: ReactNode
	text?: string
}

const EmptyContent = ({ text, actionContent }: Props) => {
   return (
		<div className={'w-full min-h-[400px] flex flex-col gap-4 items-center justify-center'}>
			<CloudSnowIcon className={'size-20 text-gray-400'} />
			<p className={'text-center text-muted-foreground max-w-screen-sm'}>{text ?? 'Pas de contenu disponible !'}</p>
			{actionContent}
		</div>
	)
}

export default EmptyContent
