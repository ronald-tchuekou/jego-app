import { Auth } from '@/services/auth-service'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { JSX, ReactNode } from 'react'
import { AuthProvider } from './auth'
import QueryProviders from './query-provider'
import { ThemeProvider } from './theme-provider'

type Props = { children: ReactNode; auth: Auth | null }
type Provider = (p: Props) => JSX.Element

export const composeProviders = (...p: Provider[]) =>
   p.reduceRight(
      (Acc, P) =>
         ({ children, ...props }: Props) =>
            (
               <P {...props}>
                  <Acc {...props}>{children}</Acc>
               </P>
            ),
      ({ children }) => <>{children}</>
   )

// USE CASE
export const AppProviders = composeProviders(ThemeProvider, QueryProviders, AuthProvider, NuqsAdapter)
