import { useEffect, useState } from 'react';
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { fetchByCatagory } from '../../redux/action/product';
import SingleProduct from './../ecommerce/SingleProduct';
import axiosInstance from '../../config/axiosInstance';

SwiperCore.use([Navigation]);

const RelatedSlider = ({ productId }) => {
    const [related, setRelated] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            // With Category
            try {
                const response = await axiosInstance.get(`/api/product/related/${productId}`);
                const sortedProducts = [...response.data.data].sort((a, b) => b.relatedRank - a.relatedRank);
                setRelated(sortedProducts);
            } catch (e) {
                console.error(e);
            }
        };
        fetchProducts();
    }, [productId]);

    return (
        <>
            <Swiper
                slidesPerView={4}
                spaceBetween={30}
                //loop={false}
                navigation={{
                    prevEl: '.custom_prev_n',
                    nextEl: '.custom_next_n',
                }}
                className="custom-class"
            >
                {related.map((product, i) => (
                    <SwiperSlide key={i}>
                        <SingleProduct product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="slider-arrow slider-arrow-2 carausel-6-columns-arrow">
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

export default RelatedSlider;
