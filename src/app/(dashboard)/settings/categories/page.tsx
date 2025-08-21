import dynamic from 'next/dynamic'

const DynamicCategoryList = dynamic(() => import('@/features/categories/components/category_list'), {
   loading: () => <p>Loading...</p>,
})

export default function CategoriesPage() {
   return <DynamicCategoryList />
}
