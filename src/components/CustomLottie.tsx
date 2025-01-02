import Lottie from 'react-lottie'

type CustomLottieProps = {
  animationData: unknown
  width?: number | string
  height?: number | string
}

export const CustomLottie: React.FC<CustomLottieProps> = ({ animationData, width = 250, height = 250 }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }
  return (
    <div>
      <Lottie options={defaultOptions} height={width} width={height} />
    </div>
  )
}
