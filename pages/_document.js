import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='es'>
      <Head>
        <meta name="keywords" content="chat anonimo" />
        <meta name="description" content="Chatea anonimamente en Anonytalk, crea un grupo comparti el nombre y empeza a chatear" />
        <meta name='image' content='/img/preview.png"'></meta>
        <meta property="og:image" content="/img/preview.png" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="256" />
        <meta property="og:image:alt" content="Anonytalk" />
        <meta property="og:title" content="Anonytalk Chat" />
        <meta property="og:description" content="Chatea anonimamente en Anonytalk, crea un grupo comparti el nombre y empeza a chatear" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_AR" />
        <meta property="og:url" content="https://anonytalk.netlify.app"/>
        <link rel='shortcut icon' href='favicon.ico'></link>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,500;1,600;1,700;1,800;1,900&family=Varela+Round&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}