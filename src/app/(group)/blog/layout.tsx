import { Metadata } from 'next'

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

export const metadata: Metadata = {
  title: 'Articles by Tobias Barth, Web Freelancer from Berlin',
  description:
    'Articles about web development and design, HTML, CSS and JavaScript, Single-Page-Applications with ReactJS and without, performance and best practices.',
  alternates: {
    types: {
      'application/rss+xml': '/blog/feed/rss.xml',
    },
  },
}
