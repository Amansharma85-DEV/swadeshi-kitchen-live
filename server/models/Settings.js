const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  restaurantName: { type: String, default: 'Swadeshi Kitchen' },
  phoneNumber: { type: String, default: '+919599749976' },
  whatsAppNumber: { type: String, default: '919599749976' },
  email: { type: String, default: 'swadeshikitchen0@gmail.com' },
  address: { type: String, default: '53-A Arjun Park, Najafgarh, New Delhi 110043' },
  openingHours: { type: String, default: '8 AM - 12 PM' },
  googleMapsLink: { type: String },
  socialMediaLinks: {
    instagram: { type: String, default: 'https://www.instagram.com/swade_shikitchen' },
    facebook: { type: String },
    zomato: { type: String, default: 'https://zomato.onelink.me/xqzv/gv2aw1bn' }
  },
  heroSection: {
    title: { type: String, default: 'Veg thali and stuffed parathas' },
    subtitle: { type: String, default: 'Order direct, on Zomato, or message us for daily deals and bulk meal boxes.' },
    ctaText: { type: String, default: 'View menu' },
    heroImage: { type: String, default: '/hero_bg.png' },
    backgroundImage: { type: String }
  },
  seo: {
    websiteTitle: { type: String, default: 'Swadeshi Kitchen' },
    metaDescription: { type: String, default: 'Homemade daily thalis and stuffed parathas for Dwarka, Delhi.' },
    keywords: { type: String, default: 'thali, paratha, food delivery, dwarka' },
    openGraphImage: { type: String },
    favicon: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
