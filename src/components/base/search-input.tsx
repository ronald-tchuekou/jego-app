'use client'
import debounce from 'lodash.debounce'
import { SearchIcon } from 'lucide-react'
import { parseAsInteger, useQueryState } from 'nuqs'
import { ChangeEventHandler, useCallback } from 'react'
import { Input } from '../ui/input'

function SearchInput() {
   const [query, setQuery] = useQueryState('q', {
      defaultValue: '',
      clearOnDefault: true,
   })
   const [, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

   const onQuery = debounce((query: string) => {
      setQuery(query, { scroll: true }).then()
   }, 500)

   const handleQuery: ChangeEventHandler<HTMLInputElement> = useCallback(
      (e) => {
         onQuery(e.target.value)
         setPage(null).then()
      },
      [onQuery, setPage],
   )

   return (
      <div className='relative bg-card rounded-lg shadow-lg w-full lg:max-w-[400px]'>
         <Input
            placeholder='Rechercher...'
            defaultValue={query}
            onChange={handleQuery}
            className='w-full pl-8 bg-transparent'
         />
         <SearchIcon className='size-5 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400' />
      </div>
   )
}

export default SearchInput
