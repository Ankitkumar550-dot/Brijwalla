import User from "../models/user.model.js";
import Shop from "../models/shopModel.js";
import Item from "../models/itemModel.js";

export const seedDatabase = async () => {
  try {
    console.log("Checking database for seeding Brijwalla sweets...");

    // Find or create an owner and a shop
    let shop = await Shop.findOne({});
    if (!shop) {
      console.log("No shop found in DB. Creating a default owner and shop...");
      let owner = await User.findOne({ role: "owner" });
      if (!owner) {
        owner = await User.create({
          fullName: "Brijwalla Confectionery Owner",
          email: "owner@brijwalla.com",
          mobile: "9876543210",
          role: "owner",
          isOtpVerified: true,
        });
      }
      shop = await Shop.create({
        name: "Brij Confectionery & Sweets",
        image: "https://images.unsplash.com/photo-1587314168485-3236d6710814",
        owner: owner._id,
        city: "Vrindavan",
        state: "Uttar Pradesh",
        address: "Raman Reti, Vrindavan",
      });
      console.log("Default shop created:", shop.name);
    }

    // Categories config and image counts
    const categoriesSeed = [
      { category: "Pedha", prefix: "peda", count: 17 },
      { category: "Laddoo", prefix: "laddu", count: 15 },
      { category: "Barfi", prefix: "burfi", count: 16 },
      { category: "Rasgulla", prefix: "rasgulla", count: 13 },
      { category: "Gulabjamun", prefix: "gulabjamun", count: 15 },
      { category: "Rasmalai", prefix: "rasmilai", count: 20 }
    ];

    for (const catInfo of categoriesSeed) {
      const existingCount = await Item.countDocuments({ category: catInfo.category });
      if (existingCount === 0) {
        console.log(`Seeding ${catInfo.category} items...`);
        const itemsToCreate = [];
        for (let i = 1; i <= catInfo.count; i++) {
          const imageKey = `${catInfo.prefix}${i}`;
          itemsToCreate.push({
            name: `${catInfo.category} Special #${i}`,
            image: imageKey,
            category: catInfo.category,
            foodType: "sweet",
            price: 180 + (i * 15),
            shop: shop._id,
          });
        }
        const createdItems = await Item.insertMany(itemsToCreate);
        
        // Push newly created item IDs into shop's items array
        shop.items.push(...createdItems.map(item => item._id));
        await shop.save();
        console.log(`Successfully seeded ${createdItems.length} items for ${catInfo.category}`);
      } else {
        console.log(`${catInfo.category} category already has ${existingCount} items. Skipping.`);
      }
    }

    console.log("Database seed check finished.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
