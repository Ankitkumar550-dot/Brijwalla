export const resolveLocalImage = (imageKey) => {
  if (!imageKey) return "";
  
  // If it's already an absolute URL (like an uploaded cloudinary URL or unsplash), return it
  if (imageKey.startsWith("http://") || imageKey.startsWith("https://") || imageKey.startsWith("data:")) {
    return imageKey;
  }

  // Define globs for each folder
  const globs = {
    peda: import.meta.glob("../assets/pedas/*.{png,jpg,jpeg,webp,avif}", { eager: true }),
    laddu: import.meta.glob("../assets/laddoo/*.{png,jpg,jpeg,webp,avif}", { eager: true }),
    burfi: import.meta.glob("../assets/Burfis/*.{png,jpg,jpeg,webp,avif}", { eager: true }),
    rasgulla: import.meta.glob("../assets/rasgulla/*.{png,jpg,jpeg,webp,avif}", { eager: true }),
    gulabjamun: import.meta.glob("../assets/gulabjamun/*.{png,jpg,jpeg,webp,avif}", { eager: true }),
    rasmilai: import.meta.glob("../assets/Rasmilai/*.{png,jpg,jpeg,webp,avif}", { eager: true }),
  };

  // Find prefix (e.g. "peda" from "peda5")
  const prefix = imageKey.replace(/[0-9]/g, "");
  const globGroup = globs[prefix.toLowerCase()];

  if (globGroup) {
    const matchKey = Object.keys(globGroup).find((key) => {
      const filename = key.split("/").pop().split(".")[0];
      return filename.toLowerCase() === imageKey.toLowerCase();
    });
    if (matchKey && globGroup[matchKey]) {
      return globGroup[matchKey].default;
    }
  }

  return imageKey;
};
