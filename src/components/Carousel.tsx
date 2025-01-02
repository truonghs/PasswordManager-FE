import { useEffect, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export const LogoCarousel = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = 150000
    const duration = 2000
    const stepTime = Math.abs(Math.floor(duration / end))

    const timer = setInterval(() => {
      start += 500
      setCount(start)
      if (start === end) clearInterval(timer)
    }, stepTime)

    return () => clearInterval(timer)
  }, [])

  const settings = {
    infinite: true,
    speed: 5000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
    swipe:true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } }
    ]
  };
  
  const logos = [
    'https://www.ibm.com/brand/experience-guides/developer/b1db1ae501d522a1a4b49613fe07c9f1/01_8-bar-positive.svg',
    'https://assets-global.website-files.com/60859bd6bcdbd1376fd8504b/64005db3442ed885977389f5_Slack_icon_2019.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Canva_Logo.svg/2560px-Canva_Logo.svg.png',
    'https://upload.wikimedia.org/wikipedia/commons/1/17/Google-flutter-logo.png',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvpQr7jRfGRZXz54j5HdGf6MDP8w5l53a3UQ&s'
  ]

  return (
    <section className='logo-carousel py-12 bg-white'>
      <h2 className='text-center text-2xl font-semibold mb-10'>
        {count.toLocaleString()}+ businesses trust Go Pass Manager
      </h2>
      <Slider {...settings}>
        {logos.map((src, index) => (
          <div key={index} className='px-4'>
            <img src={src} alt={`Company Logo ${index + 1}`} className='h-12 mx-auto' />
          </div>
        ))}
      </Slider>
    </section>
  )
}
