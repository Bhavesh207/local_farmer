import { ServiceItem, ProductItem } from '../types';

import loginHillsBg from '../assets/images/login_hills_bg_1786448509954.jpg';
import heroTractorImg from '../assets/images/ecoland_hero_tractor_1786448526931.jpg';
import soilSproutsImg from '../assets/images/ecoland_soil_sprouts_1786448541483.jpg';
import dairyCowsImg from '../assets/images/ecoland_dairy_cows_1786448555521.jpg';
import humanExpertiseImg from '../assets/images/human_expertise_advisory.jpg';

export const IMAGES = {
  loginHillsBg,
  heroTractorImg,
  soilSproutsImg,
  dairyCowsImg,
  humanExpertise: humanExpertiseImg,
  // Additional high quality CDN images for extra services and shop items
  consultingField: heroTractorImg,
  soilTesting: soilSproutsImg,
  dairyFarm: dairyCowsImg,
  greenhouse: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
  harvesting: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
  organicFertilizer: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=800&q=80',
  farmerVideoThumb: humanExpertiseImg,
  avatar1: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  avatar2: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  avatar3: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
};

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'mandi-price',
    tag: 'Live Market Intelligence',
    title: 'Mandi Price Index',
    description: 'Real-time daily mandi rates, crop price trends, and best market arrival forecasts across nationwide hubs.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    fullDetails: {
      overview: 'Track live Mandi market rates across regional hubs. Compare daily minimum, maximum, and modal prices for wheat, rice, tomatoes, cotton, and oilseeds to sell at peak market value.',
      features: ['Live Mandi Rate Stream', 'Market Arrival Volume Track', '7-Day Price Trend Forecast', 'Nearby Mandi Distance Filter'],
      pricing: 'Free Live Access'
    }
  },
  {
    id: 'crop-calendar',
    tag: 'Seasonal Planning',
    title: 'Crop Calendar',
    description: 'Personalized month-by-month sowing, fertilization, irrigation, and harvesting schedules optimized for your soil zone.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    fullDetails: {
      overview: 'Plan your agricultural year with precision. Our Crop Calendar aligns seed germination, fertilizer dosing, monsoon onset, and harvest dates tailored to Kharif, Rabi, and Zaid seasons.',
      features: ['Season-by-Season Sowing Timelines', 'Monsoon & Rainfall Syncing', 'Fertilizer Application Dates', 'Harvesting & Storage Schedules'],
      pricing: 'Included for All Farmers'
    }
  },
  {
    id: 'crop-disease',
    tag: 'Crop Health & Protection',
    title: 'Viral Crop Disease Finder',
    description: 'AI-assisted disease detection, leaf symptom diagnosis, and organic treatment protocols for early crop cure.',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
    fullDetails: {
      overview: 'Identify crop blights, yellow mosaic viruses, leaf curl, and bacterial wilts instantly. Get step-by-step biological control and chemical sprays before disease spreads.',
      features: ['Leaf Symptom Scanner', 'Fungal vs Viral Diagnostic', 'Organic Neem & Bio-Pesticide Solutions', 'Dosage & Safety Guidelines'],
      pricing: 'Free Symptom Checker'
    }
  },
  {
    id: 'profit-calculator',
    tag: 'Farm Economics',
    title: 'Crop Profit Calculator',
    description: 'Estimate total yield, input costs, labor expenses, and net profit margins per acre prior to sowing season.',
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80',
    fullDetails: {
      overview: 'Calculate your net farming profit before planting a seed. Input seed costs, diesel, fertilizer, labor, and expected yield to generate a full financial projection.',
      features: ['Seed, Water & Labor Cost Breakdown', 'Market Sale Price Slider', 'Profit Margin per Acre', 'ROI & Break-even Yield'],
      pricing: 'Free Smart Tool'
    }
  },
  {
    id: 'government-schemes',
    tag: 'Welfare & Subsidies',
    title: 'Government Schemes Portal',
    description: 'Explore PM-KISAN, crop insurance policies, solar pump subsidies, and zero-interest agricultural loans with instant eligibility check.',
    image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
    fullDetails: {
      overview: 'Access all state and central government agricultural schemes in one place. Discover eligible grants, subsidized tractor equipment, micro-irrigation funding, and crop loss insurance.',
      features: ['PM-KISAN Status Checker', 'Pradhan Mantri Fasal Bima Yojna', 'Solar Agriculture Pump Subsidy', 'Direct Bank Transfer Guidance'],
      pricing: 'Free Government Information'
    }
  },
  {
    id: 'human-expertise',
    tag: 'Expert Advisory',
    title: 'Human Expertise & Advisory',
    description: 'Connect directly with certified agronomists, soil scientists, and veterinary doctors via phone call, video, or field visit.',
    image: humanExpertiseImg,
    fullDetails: {
      overview: 'Speak 1-on-1 with senior agronomists and plant doctors. Get customized advice on soil health restoration, pest control, organic certification, and crop selection.',
      features: ['1-on-1 Video & Voice Call', 'On-Field Soil & Crop Diagnosis', 'Veterinary Guidance for Livestock', 'Custom Organic Farm Blueprint'],
      pricing: '$15 / consultation'
    }
  },
  {
    id: 'emergency-alerts',
    tag: 'Disaster Preparedness',
    title: 'Emergency Crop Alerts',
    description: 'Receive instant SMS & push alerts for severe weather warnings, locust attacks, frost hazards, and flood risks.',
    image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=800&q=80',
    fullDetails: {
      overview: 'Protect your harvest from unpredictable weather extremes. Get 48-hour advance storm alerts, unseasonal rainfall notices, temperature drops, and pest invasion warnings.',
      features: ['Real-Time Doppler Weather Warnings', 'Locust & Pest Outbreak Radar', 'Frost & Heatwave Survival Protocol', 'Instant Emergency Notification'],
      pricing: 'Free Emergency Service'
    }
  },
  {
    id: 'soil-fertilization',
    tag: 'Soil Enhancement',
    title: 'Soil Fertilization & Bio-Testing',
    description: 'Comprehensive soil testing and enhancement strategies for rich organic plant growth.',
    image: IMAGES.soilTesting,
    fullDetails: {
      overview: 'Transform poor soil into rich, microbial-active humus. We provide natural compost blends, mycorrhizal inoculants, and mineral balances for peak roots.',
      features: ['Full Spectrum NPK & Micronutrient Analysis', 'Custom Compost Formulations', 'Bio-char & Worm Casting Treatment', 'Moisture Retention Boost'],
      pricing: '$25 / acre'
    }
  },
  {
    id: 'dairy-production',
    tag: 'Animal Husbandry',
    title: 'Dairy & Livestock Health',
    description: 'Pasture-fed animal care, milk production optimization, and veterinary consultation.',
    image: IMAGES.dairyFarm,
    fullDetails: {
      overview: 'Ethically raised pasture-fed dairy herds produce rich A2 organic milk, raw artisanal butter, and grass-fed yogurts shipped cold to homes and stores daily.',
      features: ['100% Grass-Fed & Pasture-Raised Cows', 'Hormone & Antibiotic-Free Guarantee', 'Cold-Chain Express Delivery', 'Glass Bottle Return Program'],
      pricing: 'Subscription from $35 / week'
    }
  }
];

export const PRODUCTS_DATA: ProductItem[] = [
  // Plant Helping Products (Fertilizers, Tonics, Bio-pesticides, Soil Care)
  {
    id: 'p-fert-1',
    name: 'Organic Liquid Bio-Fertilizer (NPK 4-1-3)',
    category: 'fertilizer',
    price: 24.99,
    unit: '1 Gallon Bottle',
    rating: 4.95,
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    description: 'Cold-processed kelp and fish hydrolysate liquid plant food for rapid root & leaf development.'
  },
  {
    id: 'p-pest-1',
    name: 'Pure Cold-Pressed Neem Oil Bio-Pesticide',
    category: 'pest_control',
    price: 19.50,
    unit: '16 oz Concentrate',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    description: '100% natural organic neem oil spray. Repels aphids, spider mites, caterpillars, and fungal mildew.'
  },
  {
    id: 'p-growth-1',
    name: 'Seaweed Extract Plant Growth Booster',
    category: 'plant_growth',
    price: 22.00,
    unit: '32 oz Liquid',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    description: 'Packed with 60+ natural minerals, auxins, and trace nutrients to triple flowering and yield.'
  },
  {
    id: 'p-soil-1',
    name: 'Bio-Active Mycorrhizal Root Inoculant',
    category: 'soil',
    price: 29.99,
    unit: '2 lb Pouch',
    rating: 4.98,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    description: 'Beneficial soil fungi spore blend. Expands plant root absorption area up to 1000%.'
  },
  {
    id: 'p-fert-2',
    name: 'Organic Neem Cake Meal Powder',
    category: 'fertilizer',
    price: 16.75,
    unit: '10 lb Bag',
    rating: 4.85,
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    description: 'Dual-action organic fertilizer and root-knot nematode repellent for tomato & crop beds.'
  },
  {
    id: 'p-seeds-1',
    name: 'Heirloom Organic Vegetable Seed Starter Pack',
    category: 'seeds',
    price: 14.99,
    unit: '12 Seed Packets',
    rating: 4.92,
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb1642f?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    description: 'Non-GMO heirloom seeds including beefsteak tomatoes, sweet peppers, kale, and zucchini.'
  },
  {
    id: 'p3',
    name: 'Bio-Active Vermicompost Soil Conditioner',
    category: 'soil',
    price: 18.00,
    unit: '20 lb Bag',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    description: 'Enriched worm castings and natural humus to supercharge garden plant growth.'
  },
  {
    id: 'p1',
    name: 'Heirloom Organic Carrots',
    category: 'vegetables',
    price: 4.99,
    unit: '1 lb bunch',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1598170845058-12ef4a457939?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    description: 'Crisp, sweet purple and orange heirloom carrots grown without pesticides.'
  },
  {
    id: 'p2',
    name: 'Raw Grass-Fed Milk (A2/A2)',
    category: 'dairy',
    price: 6.50,
    unit: '1/2 Gallon Glass',
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    description: 'Pure, cream-top raw milk from pastured cows grazed on lush mountain grass.'
  },
  {
    id: 'p4',
    name: 'Organic Vine Tomatoes',
    category: 'vegetables',
    price: 5.20,
    unit: '1 lb',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    description: 'Sun-ripened ruby red tomatoes overflowing with natural sweet flavor.'
  },
  {
    id: 'p5',
    name: 'Farm Fresh Organic Strawberries',
    category: 'fruits',
    price: 6.99,
    unit: '1 Pint Box',
    rating: 4.95,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    description: 'Hand-picked juicy strawberries grown under natural California sunlight.'
  },
  {
    id: 'p6',
    name: 'Artisanal Cultured Farm Butter',
    category: 'dairy',
    price: 7.99,
    unit: '8 oz Roll',
    rating: 4.98,
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80',
    inStock: true,
    description: 'Slow-churned yellow butter with natural sea salt and high butterfat.'
  }
];

export const REVIEWS_DATA = [
  {
    id: 'r1',
    name: 'Eleanor Vance',
    role: 'Organic Market Owner',
    comment: 'Local Farmer has transformed how we source organic dairy and veggies. The quality is unmatched in California!',
    avatar: IMAGES.avatar1,
    rating: 5
  },
  {
    id: 'r2',
    name: 'Marcus Thorne',
    role: 'Sustainable Farmer',
    comment: 'Their soil testing and fertilization plan doubled my tomato crop yield naturally within one season.',
    avatar: IMAGES.avatar2,
    rating: 5
  },
  {
    id: 'r3',
    name: 'Sophia Chen',
    role: 'Farm-to-Table Chef',
    comment: 'The freshness of Local Farmer produce brings authentic field-to-plate taste to our high-end restaurant menu.',
    avatar: IMAGES.avatar3,
    rating: 5
  }
];
