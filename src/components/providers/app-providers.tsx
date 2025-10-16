import { Auth } from '@/services/auth-service'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { JSX, ReactNode } from 'react'
import { AuthProvider } from './auth'
import QueryProviders from './query-provider'
import { ThemeProvider } from './theme-provider'
import { TransmitProvider } from '@/components/providers/transmit-provider'

type Props = { children: ReactNode; auth: Auth | null }
type Provider = (p: Props) => JSX.Element

export const composeProviders = (...p: Provider[]) =>
   p.reduceRight(
      (Acc, P) => {
         const ComposedComponent = ({ children, ...props }: Props) => (
            <P {...props}>
               <Acc {...props}>{children}</Acc>
            </P>
         )
         ComposedComponent.displayName = `ComposedProvider(${P.name || 'Unknown'})`
         return ComposedComponent
      },
      (() => {
         const BaseComponent = ({ children }: { children: ReactNode }) => <>{children}</>
         BaseComponent.displayName = 'BaseProvider'
         return BaseComponent
      })(),
   )

// USE CASE
export const AppProviders = composeProviders(ThemeProvider, QueryProviders, AuthProvider, NuqsAdapter, TransmitProvider)
