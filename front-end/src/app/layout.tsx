import Head from "next/head";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <title>MyAlias</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:title" content="MyAlias" />
        <meta property="og:url" content="https://myalias.pro/" />
        <meta
          property="og:description"
          content="www.myalias.pro is a secure email alias generator that forwards emails to your real inbox. It allows you to create, enable, or delete aliases on demand. With myalias.pro, you can effectively manage and reduce spam by turning off aliases receiving excessive unwanted emails."
        />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="MyAlias" />
        <meta name="theme-color" content="#3F51B5" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://myalias.pro/" />
      </Head>
        <body>{children}</body>
    </html>
  );
}
