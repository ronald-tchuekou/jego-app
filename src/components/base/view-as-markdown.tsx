'use client'

import MarkdownView from 'react-showdown'

type Props = {
   markdown: string
}

export function ViewAsMarkdown({ markdown }: Props) {
   return (
      <MarkdownView
         className='prose prose-gray dark:prose-invert prose-p:mb-5 max-w-none'
         markdown={markdown}
         options={{
            emoji: true,
            simplifiedAutoLink: true,
            strikethrough: true,
            table: true,
            TableHead: true,
            ghCodeBlocks: true,
            tasklists: true,
            underline: true,
            smartIndentationFix: true,
            openLinksInNewWindow: true,
            simpleLineBreaks: true,
            simplifiedAutoEmphasis: true,
            simplifiedBackslashEscapes: true,
            simplifiedReferenceLinks: true,
            simplifiedTable: true,
            simplifiedTableOfContents: true,
            requireSpaceBeforeHeadingText: true,
            moreStyling: true,
         }}
      />
   )
}

export default ViewAsMarkdown
