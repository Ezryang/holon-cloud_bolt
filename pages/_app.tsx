import type { AppProps } from 'next/app'
import { ThemeProvider } from '@/components/theme-provider'
import '@/app/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp