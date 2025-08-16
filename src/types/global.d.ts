declare type PaginateResponse<T> = {
   data: T[]
   meta: {
      total: number
      perPage: number
      currentPage: number
      lastPage: number
      firstPage: number
      firstPageUrl: string
      lastPageUrl: string
      nextPageUrl: string
      previousPageUrl: string
   }
}

declare type FilterQuery = {
   page?: number
   limit?: number
   search?: string
   user_id?: string
   company_id?: string
}

declare type DashboardTabType = {
   link: string
   label: string
   icon?: ReactNode
}
