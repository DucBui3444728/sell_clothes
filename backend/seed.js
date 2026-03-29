const { sequelize, Category, Product } = require('./models');

const seedData = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB. Starting seed...');

        // 1. Create categories
        const categoriesData = [
            { name: "Men's Wear", slug: "mens-wear", description: "Luxury clothing for men" },
            { name: "Women's Wear", slug: "womens-wear", description: "Elegant clothing for women" },
            { name: "Accessories", slug: "accessories", description: "High-end accessories" },
            { name: "Leather Goods", slug: "leather-goods", description: "Premium leather items" }
        ];

        const createdCategories = await Category.bulkCreate(categoriesData, { returning: true });
        
        // Helper to find category id by slug
        const getCatId = (slug) => createdCategories.find(c => c.slug === slug).id;

        // 2. Import some products structurally
        const productsData = [
            {
                name: "Hermès Cashmere Rollneck",
                price: 1850.00,
                category_id: getCatId("mens-wear"),
                image: "https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=800",
                colors: ["#2d3748", "#e2e8f0"],
                sizes: ["M", "L", "XL"],
                stock: 12,
                rating: 5.0,
                description: "Luxurious double-faced cashmere rollneck."
            },
            {
                name: "Chanel Bouclé Tailored Jacket",
                price: 5200.00,
                category_id: getCatId("womens-wear"),
                image: "https://images.pexels.com/photos/1759622/pexels-photo-1759622.jpeg?auto=compress&cs=tinysrgb&w=800",
                colors: ["#000000", "#ffffff"],
                sizes: ["S", "M"],
                stock: 5,
                rating: 4.8,
                description: "Iconic tweed bouclé jacket with silk lining."
            },
            {
                name: "Cartier Panthère Gold Chain",
                price: 8900.00,
                category_id: getCatId("accessories"),
                image: "https://images.pexels.com/photos/1460838/pexels-photo-1460838.jpeg?auto=compress&cs=tinysrgb&w=800",
                colors: ["#ffd700"],
                sizes: ["One Size"],
                stock: 3,
                rating: 5.0,
                description: "Solid 18k gold chain necklace."
            },
            {
                name: "Gucci GG Flora Silk Dress",
                price: 3400.00,
                category_id: getCatId("womens-wear"),
                image: "https://images.pexels.com/photos/2916814/pexels-photo-2916814.jpeg?auto=compress&cs=tinysrgb&w=800",
                colors: ["#fca5a5"],
                sizes: ["S", "M", "L"],
                stock: 8,
                rating: 4.7,
                description: "Multicolor silk twill dress with floral motif."
            },
            {
                name: "Bottega Veneta Intrecciato Briefcase",
                price: 4100.00,
                category_id: getCatId("leather-goods"),
                image: "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800",
                colors: ["#000000", "#451a03"],
                sizes: ["One Size"],
                stock: 6,
                rating: 4.9,
                description: "Signature woven leather briefcase."
            },
            {
                name: "Tom Ford Velvet Tuxedo Jacket",
                price: 4850.00,
                category_id: getCatId("mens-wear"),
                image: "https://images.pexels.com/photos/1300550/pexels-photo-1300550.jpeg?auto=compress&cs=tinysrgb&w=800",
                colors: ["#7c2d12", "#000000"],
                sizes: ["40R", "42R", "44R"],
                stock: 4,
                rating: 5.0,
                description: "Peak lapel velvet tuxedo jacket."
            }
        ];

        await Product.bulkCreate(productsData);

        console.log('Seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
};

seedData();
