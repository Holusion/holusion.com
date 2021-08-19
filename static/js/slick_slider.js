$('.partner-slider').slick({
    infinite: true,
    speed: 300,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
        {
        infinite: true,
          breakpoint: 1200,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          }
        },
        {
            infinite: true,
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          }
        },
        {
            infinite: true,
          breakpoint: 375,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          }
        },
      ]
});