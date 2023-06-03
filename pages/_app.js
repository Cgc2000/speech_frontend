import '../styles/globals.css';
import { AppWrapper } from '../components/context';

export default function App({ Component, pageProps }) {
  return (
    <AppWrapper>
      <Component {...pageProps} />;
    </AppWrapper>
  )
}