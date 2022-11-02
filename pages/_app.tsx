import '../styles/globals.css'
import type { AppProps } from 'next/app'
import DefaultLayout from '../layouts/DefaultLayout'
import type { ReactElement, ReactNode } from 'react'
interface Props{
  children?:ReactNode
}
type ComponentWithPageLayout = AppProps & {
  Component: AppProps["Component"] & {
    PageLayout?: React.ComponentType<Props>;
  };
};

function MyApp({ Component, pageProps }: ComponentWithPageLayout) {
  return(
    <DefaultLayout>
    {Component.PageLayout ? (
      <Component.PageLayout>
        <Component {...pageProps} />
      </Component.PageLayout>
    ) : (
      <Component {...pageProps} />
    )}
  </DefaultLayout>
  )
   
}

export default MyApp
