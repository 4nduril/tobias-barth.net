import { FunctionComponent } from 'react'
import Image from 'next/image'

export const Portrait: FunctionComponent = () => {
  return (
    <div className="w-full mx-4 xl:mx-0 md:w-1/3 xl:w-1/4">
      <Image src="/images/Portrait.jpg" alt="" width="384" height="384" />
    </div>
  )
}
