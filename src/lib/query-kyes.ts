function generateKeys(name: string) {
   const key = {
      all: [name] as const,
      lists: () => [...key.all, 'list'] as const,
      list: (filters: string | Record<string, any>) =>
         [
            ...key.lists(),
            {
               filters: typeof filters === 'string' ? filters : JSON.stringify(filters),
            },
         ] as const,
      details: () => [...key.all, 'detail'] as const,
      detail: (id: string) => [...key.details(), id] as const,
   }

   return key
}

export const postKey = generateKeys('posts')
export const userKey = generateKeys('users')
export const categoryKey = generateKeys('categories')
