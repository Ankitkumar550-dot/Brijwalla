import express from "express";

const router = express.Router();

// Mock data for festivals based on user's examples
const festivals = [
  {
    id: 1,
    name: "Raksha Bandhan",
    description: "Celebrate the bond of love with our special Rakhi sweet hampers.",
    image: "/assets/raksha-bandhan.jpg"
  },
  {
    id: 2,
    name: "Diwali",
    description: "Light up your Diwali with our premium assortment of traditional mithais.",
    image: "/assets/diwali.jpg"
  },
  {
    id: 3,
    name: "Holi",
    description: "Add colors to your Holi celebrations with Gujiyas and Thandai sweets.",
    image: "/assets/holi.jpg"
  },
  {
    id: 4,
    name: "Janmashtami",
    description: "Offer the best Makhan Mishri and Panjiri for Lord Krishna.",
    image: "/assets/janmashtami.jpg"
  },
  {
    id: 5,
    name: "Wedding Specials",
    description: "Make your big day memorable with our grand wedding sweet boxes.",
    image: "/assets/wedding.jpg"
  }
];

router.get("/", (req, res) => {
  try {
    res.status(200).json(festivals);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch festivals" });
  }
});

export default router;
