import { useSearchParams } from 'react-router-dom';
import ProductList from '../components/products/ProductList';

const Products = () => {
  const [searchParams] = useSearchParams();
  
  const initialFilters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
  };

  return <ProductList initialFilters={initialFilters} />;
};

export default Products;