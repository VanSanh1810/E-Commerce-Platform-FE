import { useEffect, useState } from 'react';
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { server } from '../../config/index';
import SingleProduct from './../ecommerce/SingleProduct';
import { useSelector } from 'react-redux';
import axiosInstance from '../../config/axiosInstance';

SwiperCore.use([Navigation]);

const NewArrival = () => {
    const [newArrival, setNewArrival] = useState([]);
    const { productTagHistory } = useSelector((state) => state);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // With Category
                const response = await axiosInstance.post('/api/product/recomend', {
                    hisList: [...productTagHistory],
                });
                // const allProducts = await request.json();

                // const newArrivalProducts = allProducts.sort(function (a, b) {
                //     return a.created > b.created ? -1 : 1;
                // });
                const temp = [...response.data.data];
                temp.sort((a, b) => {
                    b.recommendRank - a.recommendRank;
                });

                setNewArrival([...temp]);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProducts();
    }, []);

    return (
        <>
            <Swiper
                slidesPerView={4}
                spaceBetween={15}
                //loop={false}
                navigation={{
                    prevEl: '.custom_prev_n',
                    nextEl: '.custom_next_n',
                }}
                className="carausel-6-columns carausel-arrow-center"
            >
                {newArrival.map((product, i) => (
                    <SwiperSlide key={i}>
                        <SingleProduct product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="slider-arrow slider-arrow-2 carausel-6-columns-arrow" id="carausel-6-columns-2-arrows">
                <span className="slider-btn slider-prev slick-arrow custom_prev_n">
                    <i className="fi-rs-angle-left"></i>
                </span>
                <span className="slider-btn slider-next slick-arrow custom_next_n">
                    <i className="fi-rs-angle-right"></i>
                </span>
            </div>
        </>
    );
};

export default NewArrival;
