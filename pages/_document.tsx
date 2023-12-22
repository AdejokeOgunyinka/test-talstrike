import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      <link href="https://cdn.jsdelivr.net/npm/cloudinary-video-player/dist/cld-video-player.min.css" rel="stylesheet" />

<script src="https://cdn.jsdelivr.net/npm/cloudinary-video-player/dist/cld-video-player.min.js" type="text/javascript"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
