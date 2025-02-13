import React, { ReactNode } from 'react'

interface Props {
    children?: ReactNode

}

const layout = ({children, ...props}:Props) => {
  return (
    <div {...props}>{children}</div>
  )
}

export default layout