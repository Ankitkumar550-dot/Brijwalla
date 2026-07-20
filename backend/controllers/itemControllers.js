import Item from "../models/itemModel.js";
import Shop from "../models/shopModel.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const addItem = async (req, res) => {
    try {
        const { name, category, foodType, price } = req.body;

        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path);
        }

        const shop = await Shop.findOne({ owner: req.userId }).populate("items")

        if (!shop) {
            return res.status(400).json({ message: "Shop not found" });
        }

        const item = await Item.create({
            name,
            category,
            foodType,
            price,
            image,
            shop: shop._id,
        });

        shop.items.push(item._id);
        await shop.save();

        await shop.populate("owner items");

        return res.status(201).json(shop);

    } catch (error) {
        return res.status(500).json({
            message: `add item error ${error.message}`,
        });
    }
};

export const editItem = async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const { name, category, foodType, price } = req.body;

        let updateData = {
            name,
            category,
            foodType,
            price,
        };

        if (req.file) {
            const image = await uploadOnCloudinary(req.file.path);
            updateData.image = image;
        }

        const item = await Item.findByIdAndUpdate(
            itemId,
            updateData,
            { new: true }
        );

        if (!item) {
            return res.status(404).json({
                message: "Item not found",
            });
        }

        return res.status(200).json(item);

    } catch (error) {
        return res.status(500).json({
            message: `edit item error ${error.message}`,
        });
    }
};

export const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(404).json({
                message: "Item not found",
            });
        }

        const shop = await Shop.findOne({ owner: req.userId });
        if (shop) {
            shop.items = shop.items.filter(id => id.toString() !== itemId);
            await shop.save();
        }

        await Item.findByIdAndDelete(itemId);

        return res.status(200).json({
            message: "Item deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            message: `delete item error ${error.message}`,
        });
    }
};

export const searchAndFilterItems = async (req, res) => {
  try {
    const { query, category, foodType, minPrice, maxPrice } = req.query;
    let findQuery = {};

    if (query) {
      findQuery.name = { $regex: query, $options: "i" };
    }
    if (category) {
      findQuery.category = { $regex: category, $options: "i" };
    }
    if (foodType) {
      findQuery.foodType = foodType;
    }
    if (minPrice || maxPrice) {
      findQuery.price = {};
      if (minPrice) findQuery.price.$gte = Number(minPrice);
      if (maxPrice) findQuery.price.$lte = Number(maxPrice);
    }

    const items = await Item.find(findQuery).populate("shop");
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ message: `Search items error: ${error.message}` });
  }
};

export const getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId).populate("shop");
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ message: `Get item error: ${error.message}` });
  }
};