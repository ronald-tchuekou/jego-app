'use client'

import ChartLoader from '@/components/base/chart-loader'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { CHART_PERIODS } from '@/lib/constants'
import { useQueryState } from 'nuqs'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import useGetUserChartData from '../../hooks/use-get-user-chart-data'
import ChartFilter from './chart-filter'

const chartConfig = {
   count: {
      label: 'Utilisateurs :',
      color: 'var(--primary)',
   },
} satisfies ChartConfig

export default function UserChart() {
   const [timeRange] = useQueryState('timeRange')
   const { data, isLoading } = useGetUserChartData()

   const chartData = data?.data || []

   return (
      <Card className='@container/card'>
         <CardHeader>
            <CardTitle>Statistiques des utilisateurs inscrits</CardTitle>
            <CardDescription>
               <span className='hidden @[540px]/card:block'>
                  Statistiques des utilisateurs inscrits pour les{' '}
                  {CHART_PERIODS.find((period) => period.value === timeRange)?.label}
               </span>
               <span className='@[540px]/card:hidden'>
                  Statistiques des utilisateurs inscrits pour les{' '}
                  {CHART_PERIODS.find((period) => period.value === timeRange)?.label}
               </span>
            </CardDescription>
            <CardAction>
               <ChartFilter />
            </CardAction>
         </CardHeader>
         <CardContent>
            {isLoading ? (
               <ChartLoader />
            ) : (
               <ChartContainer config={chartConfig} className='aspect-auto h-[250px] w-full'>
                  <AreaChart data={chartData}>
                     <defs>
                        <linearGradient id='fillUsers' x1='0' y1='0' x2='0' y2='1'>
                           <stop offset='5%' stopColor='var(--color-count)' stopOpacity={1.0} />
                           <stop offset='95%' stopColor='var(--color-count)' stopOpacity={0.1} />
                        </linearGradient>
                     </defs>
                     <CartesianGrid vertical={false} />
                     <XAxis
                        dataKey='date'
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={32}
                        tickFormatter={(value) => {
                           const date = new Date(value)
                           return date.toLocaleDateString('fr-FR', {
                              month: 'short',
                              day: 'numeric',
                           })
                        }}
                     />
                     <ChartTooltip
                        cursor={false}
                        content={
                           <ChartTooltipContent
                              labelFormatter={(value) => {
                                 return new Date(value).toLocaleDateString('fr-FR', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                 })
                              }}
                              indicator='dot'
                           />
                        }
                     />
                     <Area
                        dataKey='count'
                        type='monotone'
                        fill='url(#fillUsers)'
                        stroke='var(--color-count)'
                        stackId='a'
                     />
                  </AreaChart>
               </ChartContainer>
            )}
         </CardContent>
      </Card>
   )
}
