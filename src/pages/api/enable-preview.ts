import { NextApiResponse, NextApiRequest } from 'next'

const enablePreview = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query.secret !== process.env.PREVIEW_SECRET) {
    return res.status(401).json({ message: 'Invalid secret' })
  }

  res.setPreviewData({})
  if (req.query.slug) {
    return res.redirect(`/blog/${req.query.slug}`)
  }
  res.end('Preview mode enabled')
}

export default enablePreview
