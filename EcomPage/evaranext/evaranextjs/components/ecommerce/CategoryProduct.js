import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { updateProductCategory } from '../../redux/action/productFiltersAction';

const CategoryProduct = ({ setSortType }) => {
    // const router = useRouter();

    // const removeSearchTerm = () => {
    //     router.push({
    //         pathname: '/products',
    //     });
    // };

    // const selectCategory = (e, category) => {
    //     e.preventDefault();
    //     removeSearchTerm();
    //     updateProductCategory(category);
    //     // router.push('/')
    // };
    return (
        <>
            <ul className="categories">
                <li onClick={() => setSortType('')}>
                    <a>All</a>
                </li>
                <li onClick={() => setSortType('trending')}>
                    <a>Trending</a>
                </li>
                <li onClick={() => setSortType('popular')}>
                    <a>Popular</a>
                </li>
                <li onClick={() => setSortType('new')}>
                    <a>New added</a>
                </li>
            </ul>
        </>
    );
};

export default connect(null, { updateProductCategory })(CategoryProduct);
