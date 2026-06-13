const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

mongoose.connect(uri).then(async () => {
  const db = mongoose.connection.db;
  const SiteContent = db.collection('sitecontents');
  
  const docs = [
    { key: "instagram.feed.1", value: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80", type: "image", fieldType: "image", page: "home", section: "Instagram Feed", label: "Image 1", order: 1 },
    { key: "instagram.feed.2", value: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80", type: "image", fieldType: "image", page: "home", section: "Instagram Feed", label: "Image 2", order: 2 },
    { key: "instagram.feed.3", value: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80", type: "image", fieldType: "image", page: "home", section: "Instagram Feed", label: "Image 3", order: 3 },
    { key: "instagram.feed.4", value: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&q=80", type: "image", fieldType: "image", page: "home", section: "Instagram Feed", label: "Image 4", order: 4 },
    { key: "instagram.feed.5", value: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&q=80", type: "image", fieldType: "image", page: "home", section: "Instagram Feed", label: "Image 5", order: 5 },
    { key: "instagram.feed.6", value: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&q=80", type: "image", fieldType: "image", page: "home", section: "Instagram Feed", label: "Image 6", order: 6 },
  ];

  for (const doc of docs) {
    await SiteContent.updateOne({ key: doc.key }, { $set: doc }, { upsert: true });
  }

  console.log("Done");
  process.exit(0);
});
