'use client';

import { useState } from 'react';
import ProductCard from '@/components/products/ProductCard';

export default function StaticProductsPage() {
  // Women's Lawn Collection - Pakistani Fashion
  const [products] = useState([
    {
      id: 'w1',
      name: 'Elegant Floral Lawn Suit',
      topCategory: 'Women',
      category: 'Lawn',
      price: 5499,
      originalPrice: 7999,
      rating: 4.8,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500',
      images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500'],
      description: 'Beautiful floral printed lawn suit with embroidered neckline. Perfect for summer wear with premium quality fabric.',
      inStock: true,
      vendor: { name: 'StyleHub Store' }
    },
    {
      id: 'w2',
      name: 'Premium Embroidered Lawn',
      topCategory: 'Women',
      category: 'Lawn',
      price: 6999,
      originalPrice: 9500,
      rating: 4.9,
      reviews: 203,
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500',
      images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500'],
      description: 'Exquisite embroidered lawn collection with intricate designs. Features premium lawn fabric with detailed embroidery work.',
      inStock: true,
      vendor: { name: 'StyleHub Store' }
    },
    {
      id: 'w3',
      name: 'Summer Lawn Kurti',
      topCategory: 'Women',
      category: 'Lawn',
      price: 4999,
      originalPrice: 6999,
      rating: 4.6,
      reviews: 128,
      image: 'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=500',
      images: ['https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=500'],
      description: 'Comfortable and stylish lawn kurti perfect for casual summer days. Lightweight and breathable fabric.',
      inStock: true,
      vendor: { name: 'StyleHub Store' }
    },
    {
      id: 'w4',
      name: 'Designer Lawn Collection',
      topCategory: 'Women',
      category: 'Lawn',
      price: 8999,
      originalPrice: 12000,
      rating: 5.0,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500',
      images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'],
      description: 'Premium designer lawn suit with exclusive prints and embellishments. Limited edition collection.',
      inStock: true,
      vendor: { name: 'StyleHub Store' }
    },
    {
      id: 'w5',
      name: 'Printed Lawn Dress',
      topCategory: 'Women',
      category: 'Lawn',
      price: 5799,
      originalPrice: 8500,
      rating: 4.7,
      reviews: 167,
      image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=500',
      images: ['https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=500'],
      description: 'Vibrant printed lawn dress with modern cuts. Perfect blend of traditional and contemporary style.',
      inStock: true,
      vendor: { name: 'StyleHub Store' }
    },
    {
      id: 'w6',
      name: 'Luxury Lawn Ensemble',
      topCategory: 'Women',
      category: 'Lawn',
      price: 9999,
      originalPrice: 14000,
      rating: 4.9,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=500',
      images: ['https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=500'],
      description: 'Luxurious lawn ensemble with premium embroidery and fine detailing. Complete 3-piece suit.',
      inStock: true,
      vendor: { name: 'StyleHub Store' }
    },
    {
      id: 'w7',
      name: 'Casual Lawn Outfit',
      topCategory: 'Women',
      category: 'Lawn',
      price: 4599,
      originalPrice: 6500,
      rating: 4.5,
      reviews: 145,
      image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500',
      images: ['https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500'],
      description: 'Easy-to-wear casual lawn outfit for everyday comfort. Soft and breathable fabric.',
      inStock: true,
      vendor: { name: 'StyleHub Store' }
    },
    {
      id: 'w8',
      name: 'Festive Lawn Collection',
      topCategory: 'Women',
      category: 'Lawn',
      price: 7499,
      originalPrice: 10500,
      rating: 4.8,
      reviews: 198,
      image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500',
      images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500'],
      description: 'Festive lawn collection with rich colors and elegant embroidery. Perfect for special occasions.',
      inStock: true,
      vendor: { name: 'StyleHub Store' }
    },
  ]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Static Products</h1>
          <p className="text-gray-600">Edit the page.js file to add your products</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products added yet. Edit the page.js file to add your products.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
