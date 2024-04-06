import React from 'react';
import ProductDetails from '../../components/ecommerce/ProductDetails';
import Layout from '../../components/layout/Layout';
import { server } from '../../config/index';
import { findProductIndex } from '../../util/util';
import axiosInstance from '../../config/axiosInstance';

const ProductId = ({ product }) => {
    return (
        <>
            <Layout parent="Home" sub="Shop" subChild={product._id}>
                <div className="container">
                    <ProductDetails product={product} />
                </div>
            </Layout>
        </>
    );
};

ProductId.getInitialProps = async (params) => {
    try {
        const result = await axiosInstance.get(`/api/product/${params.query.slug}`);
        console.log(result.data);
        return { product: result.data.data };
    } catch (err) {
        console.log(err);
    }
    // console.log(params);
};

export default ProductId;
