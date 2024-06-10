import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import { updateProductCategory } from '../../redux/action/productFiltersAction';

const CategoryProduct = ({ setSortType, setCurrentPage }) => {
    return (
        <>
            <ul className="categories">
                <li
                    onClick={() => {
                        setSortType('');
                        setCurrentPage(1);
                    }}
                >
                    <a>All</a>
                </li>
                <li
                    onClick={() => {
                        setSortType('trending');
                        setCurrentPage(1);
                    }}
                >
                    <a>Trending</a>
                </li>
                <li
                    onClick={() => {
                        setSortType('popular');
                        setCurrentPage(1);
                    }}
                >
                    <a>Popular</a>
                </li>
                <li
                    onClick={() => {
                        setSortType('new');
                        setCurrentPage(1);
                    }}
                >
                    <a>New added</a>
                </li>
            </ul>
        </>
    );
};

export default connect(null, { updateProductCategory })(CategoryProduct);
