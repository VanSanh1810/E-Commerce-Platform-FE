import React, { useEffect } from 'react';
import ProductDetails from '../../components/ecommerce/ProductDetails';
import Layout from '../../components/layout/Layout';
import { server } from '../../config/index';
import { findProductIndex } from '../../util/util';
import axiosInstance from '../../config/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { addTagHistory } from '../../redux/action/productTagHistory';

const ProductId = ({ product }) => {
    const { userId } = useSelector((state) => state);
    const dispatch = useDispatch();
    useEffect(() => {
        if (!userId) {
            console.log(product);
            const pTagList = product.tag.split(',').map((tag) => tag.trim());
            const pushHistoryTag = async () => {
                for (let i = 0; i < pTagList.length; i++) {
                    dispatch(addTagHistory(pTagList[i], 2));
                }
            };
            pushHistoryTag();
        }
        return () => console.log('11');
    }, [userId, product]);
    return (
        <>
            <Layout parent="Home" sub="Product" subChild={product.name}>
                <div className="container">
                    <ProductDetails product={product} />
                </div>
            </Layout>
        </>
    );
};

ProductId.getInitialProps = async (params) => {
    try {
        const result = await axiosInstance.get(`/api/product/${params.query.slug}?historyAction=${true}`);
        return { product: result.data.data };
    } catch (err) {
        console.log(err);
    }
};

export default ProductId;
