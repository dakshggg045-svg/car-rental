import { Vehicle } from '@/types';

const IMG = {
  economy:  '/images/car-economy.jpg',
  compact:  '/images/car-compact.jpg',
  sedan:    '/images/car-sedan.jpg',
  suv:      '/images/car-suv.jpg',
  luxury:   '/images/car-luxury.jpg',
  van:      '/images/car-van.jpg',
  sports:   '/images/car-sports.jpg',
  electric: '/images/car-electric.jpg',
};

export const VEHICLE_IMAGES: Record<string, string[]> = {
  economy: [IMG.economy], compact: [IMG.compact], sedan: [IMG.sedan], suv: [IMG.suv],
  luxury: [IMG.luxury], van: [IMG.van], sports: [IMG.sports], electric: [IMG.electric],
};

function img(category: string): string[] {
  return VEHICLE_IMAGES[category.toLowerCase()] || [IMG.sedan];
}

export const initialVehicles: Vehicle[] = [
  // ── Economy ──
  { id:'v001', make:'Maruti Suzuki', model:'Swift', year:2024, daily_rate:1500, category:'Economy', specs:{fuel:'Gasoline',transmission:'Manual',seats:5,doors:4,luggage:2,ac:true,gps:false}, image_urls:img('economy'), status:'available', color:'White', plate:'MH-01-AB-1234', mileage:12400 },
  { id:'v002', make:'Hyundai', model:'i20', year:2024, daily_rate:1800, category:'Economy', specs:{fuel:'Gasoline',transmission:'Automatic',seats:5,doors:4,luggage:2,ac:true,gps:false}, image_urls:img('economy'), status:'available', color:'Silver', plate:'MH-02-CD-5678', mileage:8700 },
  { id:'v003', make:'Tata', model:'Altroz', year:2023, daily_rate:1400, category:'Economy', specs:{fuel:'Gasoline',transmission:'Manual',seats:5,doors:4,luggage:2,ac:true,gps:false}, image_urls:img('economy'), status:'available', color:'Blue', plate:'MH-04-EF-9012', mileage:21000 },
  { id:'v004', make:'Maruti Suzuki', model:'Baleno', year:2024, daily_rate:1600, category:'Economy', specs:{fuel:'Gasoline',transmission:'Automatic',seats:5,doors:4,luggage:2,ac:true,gps:true}, image_urls:img('economy'), status:'available', color:'Red', plate:'MH-03-GH-3456', mileage:5300 },

  // ── Compact ──
  { id:'v005', make:'Volkswagen', model:'Virtus', year:2024, daily_rate:2500, category:'Compact', specs:{fuel:'Gasoline',transmission:'Automatic',seats:5,doors:4,luggage:3,ac:true,gps:true}, image_urls:img('compact'), status:'available', color:'Black', plate:'DL-01-AB-1111', mileage:15600 },
  { id:'v006', make:'Honda', model:'City', year:2024, daily_rate:2800, category:'Compact', specs:{fuel:'Hybrid',transmission:'Automatic',seats:5,doors:4,luggage:3,ac:true,gps:true}, image_urls:img('compact'), status:'available', color:'Gray', plate:'DL-02-CD-2222', mileage:9800 },
  { id:'v007', make:'Hyundai', model:'Verna', year:2024, daily_rate:2600, category:'Compact', specs:{fuel:'Gasoline',transmission:'Automatic',seats:5,doors:4,luggage:3,ac:true,gps:true}, image_urls:img('compact'), status:'available', color:'White', plate:'DL-03-EF-3333', mileage:11200 },
  { id:'v008', make:'Skoda', model:'Slavia', year:2024, daily_rate:2700, category:'Compact', specs:{fuel:'Gasoline',transmission:'Automatic',seats:5,doors:4,luggage:3,ac:true,gps:true}, image_urls:img('compact'), status:'maintenance', color:'Red', plate:'DL-04-GH-4444', mileage:18500 },

  // ── Sedan ──
  { id:'v009', make:'Toyota', model:'Camry', year:2024, daily_rate:5500, category:'Sedan', specs:{fuel:'Hybrid',transmission:'Automatic',seats:5,doors:4,luggage:4,ac:true,gps:true}, image_urls:img('sedan'), status:'available', color:'Silver', plate:'KA-01-AB-1001', mileage:7600 },
  { id:'v010', make:'Honda', model:'Accord', year:2024, daily_rate:5200, category:'Sedan', specs:{fuel:'Gasoline',transmission:'Automatic',seats:5,doors:4,luggage:4,ac:true,gps:true}, image_urls:img('sedan'), status:'available', color:'Black', plate:'KA-02-CD-2002', mileage:13400 },
  { id:'v011', make:'Skoda', model:'Superb', year:2023, daily_rate:4800, category:'Sedan', specs:{fuel:'Gasoline',transmission:'Automatic',seats:5,doors:4,luggage:4,ac:true,gps:true}, image_urls:img('sedan'), status:'available', color:'Blue', plate:'KA-03-EF-3003', mileage:25000 },
  { id:'v012', make:'Hyundai', model:'Sonata', year:2024, daily_rate:4500, category:'Sedan', specs:{fuel:'Gasoline',transmission:'Automatic',seats:5,doors:4,luggage:4,ac:true,gps:true}, image_urls:img('sedan'), status:'available', color:'White', plate:'KA-04-GH-4004', mileage:6200 },

  // ── SUV ──
  { id:'v013', make:'Toyota', model:'Fortuner', year:2024, daily_rate:6500, category:'SUV', specs:{fuel:'Diesel',transmission:'Automatic',seats:7,doors:4,luggage:5,ac:true,gps:true}, image_urls:img('suv'), status:'available', color:'White', plate:'TN-01-AB-5001', mileage:8900 },
  { id:'v014', make:'Mahindra', model:'XUV700', year:2024, daily_rate:4500, category:'SUV', specs:{fuel:'Diesel',transmission:'Automatic',seats:7,doors:4,luggage:5,ac:true,gps:true}, image_urls:img('suv'), status:'available', color:'Black', plate:'TN-02-CD-6002', mileage:14500 },
  { id:'v015', make:'Hyundai', model:'Tucson', year:2024, daily_rate:5000, category:'SUV', specs:{fuel:'Diesel',transmission:'Automatic',seats:5,doors:4,luggage:5,ac:true,gps:true}, image_urls:img('suv'), status:'available', color:'Gray', plate:'TN-03-EF-7003', mileage:11000 },
  { id:'v016', make:'MG', model:'Gloster', year:2024, daily_rate:5500, category:'SUV', specs:{fuel:'Diesel',transmission:'Automatic',seats:7,doors:4,luggage:6,ac:true,gps:true}, image_urls:img('suv'), status:'available', color:'Blue', plate:'TN-04-GH-8004', mileage:19200 },
  { id:'v017', make:'Tata', model:'Harrier', year:2024, daily_rate:3800, category:'SUV', specs:{fuel:'Diesel',transmission:'Automatic',seats:5,doors:4,luggage:4,ac:true,gps:true}, image_urls:img('suv'), status:'available', color:'Red', plate:'TN-05-IJ-9005', mileage:3400 },

  // ── Luxury ──
  { id:'v018', make:'BMW', model:'5 Series', year:2024, daily_rate:15000, category:'Luxury', specs:{fuel:'Gasoline',transmission:'Automatic',seats:5,doors:4,luggage:4,ac:true,gps:true}, image_urls:img('luxury'), status:'available', color:'Black', plate:'MH-01-LX-0001', mileage:5600 },
  { id:'v019', make:'Mercedes-Benz', model:'E-Class', year:2024, daily_rate:18000, category:'Luxury', specs:{fuel:'Gasoline',transmission:'Automatic',seats:5,doors:4,luggage:4,ac:true,gps:true}, image_urls:img('luxury'), status:'available', color:'Silver', plate:'MH-02-LX-0002', mileage:8200 },
  { id:'v020', make:'Audi', model:'A6', year:2024, daily_rate:16000, category:'Luxury', specs:{fuel:'Gasoline',transmission:'Automatic',seats:5,doors:4,luggage:4,ac:true,gps:true}, image_urls:img('luxury'), status:'available', color:'White', plate:'MH-03-LX-0003', mileage:4100 },
  { id:'v021', make:'Lexus', model:'ES', year:2024, daily_rate:14000, category:'Luxury', specs:{fuel:'Hybrid',transmission:'Automatic',seats:5,doors:4,luggage:4,ac:true,gps:true}, image_urls:img('luxury'), status:'available', color:'Blue', plate:'MH-04-LX-0004', mileage:7800 },

  // ── Van ──
  { id:'v022', make:'Toyota', model:'Innova Crysta', year:2024, daily_rate:4000, category:'Van', specs:{fuel:'Diesel',transmission:'Automatic',seats:8,doors:4,luggage:6,ac:true,gps:true}, image_urls:img('van'), status:'available', color:'Silver', plate:'GJ-01-VN-1001', mileage:16800 },
  { id:'v023', make:'Kia', model:'Carnival', year:2024, daily_rate:5500, category:'Van', specs:{fuel:'Diesel',transmission:'Automatic',seats:7,doors:4,luggage:6,ac:true,gps:true}, image_urls:img('van'), status:'available', color:'White', plate:'GJ-02-VN-2002', mileage:22100 },
  { id:'v024', make:'Toyota', model:'Innova Hycross', year:2024, daily_rate:4500, category:'Van', specs:{fuel:'Hybrid',transmission:'Automatic',seats:8,doors:4,luggage:6,ac:true,gps:true}, image_urls:img('van'), status:'available', color:'Gray', plate:'GJ-03-VN-3003', mileage:19500 },

  // ── Sports ──
  { id:'v025', make:'Ford', model:'Mustang', year:2024, daily_rate:12000, category:'Sports', specs:{fuel:'Gasoline',transmission:'Automatic',seats:4,doors:2,luggage:2,ac:true,gps:true}, image_urls:img('sports'), status:'available', color:'Red', plate:'MH-01-SP-0001', mileage:6700 },
  { id:'v026', make:'BMW', model:'Z4', year:2024, daily_rate:14000, category:'Sports', specs:{fuel:'Gasoline',transmission:'Automatic',seats:2,doors:2,luggage:1,ac:true,gps:true}, image_urls:img('sports'), status:'available', color:'Yellow', plate:'MH-02-SP-0002', mileage:4300 },
  { id:'v027', make:'Porsche', model:'718 Cayman', year:2024, daily_rate:25000, category:'Sports', specs:{fuel:'Gasoline',transmission:'Automatic',seats:2,doors:2,luggage:1,ac:true,gps:true}, image_urls:img('sports'), status:'available', color:'White', plate:'MH-03-SP-0003', mileage:2100 },

  // ── Electric ──
  { id:'v028', make:'Tata', model:'Nexon EV', year:2024, daily_rate:3000, category:'Electric', specs:{fuel:'Electric',transmission:'Automatic',seats:5,doors:4,luggage:3,ac:true,gps:true}, image_urls:img('electric'), status:'available', color:'Teal', plate:'DL-01-EV-0001', mileage:9200 },
  { id:'v029', make:'MG', model:'ZS EV', year:2024, daily_rate:3500, category:'Electric', specs:{fuel:'Electric',transmission:'Automatic',seats:5,doors:4,luggage:4,ac:true,gps:true}, image_urls:img('electric'), status:'available', color:'White', plate:'DL-02-EV-0002', mileage:7500 },
  { id:'v030', make:'BMW', model:'iX1', year:2024, daily_rate:8000, category:'Electric', specs:{fuel:'Electric',transmission:'Automatic',seats:5,doors:4,luggage:4,ac:true,gps:true}, image_urls:img('electric'), status:'available', color:'Blue', plate:'DL-03-EV-0003', mileage:3800 },
  { id:'v031', make:'Hyundai', model:'Ioniq 5', year:2024, daily_rate:7000, category:'Electric', specs:{fuel:'Electric',transmission:'Automatic',seats:5,doors:4,luggage:3,ac:true,gps:true}, image_urls:img('electric'), status:'available', color:'Green', plate:'DL-04-EV-0004', mileage:14200 },
  { id:'v032', make:'Tata', model:'Tiago EV', year:2024, daily_rate:2000, category:'Electric', specs:{fuel:'Electric',transmission:'Automatic',seats:5,doors:4,luggage:2,ac:true,gps:true}, image_urls:img('electric'), status:'maintenance', color:'Silver', plate:'DL-05-EV-0005', mileage:18700 },
];
