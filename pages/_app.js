import '@/styles/globals.css'
import { AuthProvider } from '@/utils/auth'

export default function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
            <Component {...pageProps} />
        </AuthProvider>
    )
}
