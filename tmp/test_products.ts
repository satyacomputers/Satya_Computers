import { products } from './data/products';

console.log('Successfully loaded ' + products.length + ' products.');
const lastProduct = products[products.length - 1];
console.log('Last product:', lastProduct.id);
