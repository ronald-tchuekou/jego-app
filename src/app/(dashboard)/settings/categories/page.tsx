import dynamic from 'next/dynamic'

const DynamicCategoryList = dynamic(() => import('@/features/categories/components/category_list'))

export default function CategoriesPage() {
   return <DynamicCategoryList />
}
