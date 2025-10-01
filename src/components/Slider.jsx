import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Slider.css';

import slide_image_1 from '../../public/slides/slide1.png';
import slide_image_2 from '../../public/slides/slide2.png';
import slide_image_3 from '../../public/slides/slide3.png';

import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';

const slides = [
  { img: slide_image_1, text: 'Tech Events' },
  { img: slide_image_2, text: 'Fun Events' },
  { img: slide_image_3, text: 'Cultural Events' }
];

export function Slider() {
  return (
    <div className="container text-Japan Ramen">
      <h1 className="heading">Events</h1>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        pagination={{ el: '.swiper-pagination', clickable: true }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          clickable: true,
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="swiper_container"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="slide-card">
              <img src={slide.img} alt={`slide_image_${index + 1}`} />
              <div className="slide-text">{slide.text}</div>
            </div>
          </SwiperSlide>
        ))}

        <div className="slider-controler">
          <div className="swiper-button-prev slider-arrow">
            <ion-icon name="arrow-back-outline"></ion-icon>
          </div>
          <div className="swiper-button-next slider-arrow">
            <ion-icon name="arrow-forward-outline"></ion-icon>
          </div>
          <div className="swiper-pagination"></div>
        </div>
      </Swiper>
    </div>
  );
}
