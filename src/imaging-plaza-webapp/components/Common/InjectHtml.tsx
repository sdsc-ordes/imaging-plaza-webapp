interface Props {
  data?: string
}

const InjectHtml = ({data}: Props) => {
  return (
    <>
      {data && (
        <span
          dangerouslySetInnerHTML={{
            __html: data,
          }}></span>
      )}
    </>
  )
}
export default InjectHtml
