'use client'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import { toast } from 'sonner'

export default function ExportButton() {
   const handleExportCSV = () => {
      //TODO Implement CSV export logic here
      toast.info('Export CSV en cours de développement')
   }

   const handleExportPDF = () => {
      //TODO Implement PDF export logic here
      toast.info('Export PDF en cours de développement')
   }

   const handleExportExcel = () => {
      //TODO Implement Excel export logic here
      toast.info('Export Excel en cours de développement')
   }

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant='outline' className='bg-card shadow-lg'>
               <Download />
               Exporter
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={handleExportCSV}>
               <FileText />
               Export CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportExcel}>
               <FileSpreadsheet />
               Export Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportPDF}>
               <FileText />
               Export PDF
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   )
}
