const db = require('./config/db');
const Product = require('./models/Product');

// --- DATABASE PRODUK REAL-WORLD (200+ ITEM UNIK) ---

const laptops = [
    // ASUS
    { name: "ASUS ROG Strix SCAR 18 G834", price: 65999000, cat: "Laptop", desc: "i9-13980HX, RTX 4090, 32GB, 2TB SSD." },
    { name: "ASUS ROG Zephyrus G14 (2024)", price: 29999000, cat: "Laptop", desc: "Ryzen 9 8945HS, RTX 4060, OLED 3K." },
    { name: "ASUS ROG Zephyrus Duo 16", price: 48000000, cat: "Laptop", desc: "Dual Screen Gaming Laptop, RTX 4080." },
    { name: "ASUS TUF Gaming A15 FA507", price: 17499000, cat: "Laptop", desc: "Ryzen 7 7735HS, RTX 4060, Military Grade." },
    { name: "ASUS TUF Gaming F15", price: 15499000, cat: "Laptop", desc: "i7-12700H, RTX 4050, 144Hz." },
    { name: "ASUS Zenbook S 13 OLED", price: 20999000, cat: "Laptop", desc: "Laptop ter-tipis di dunia, i7 Ultra." },
    { name: "ASUS Vivobook Pro 15 OLED", price: 14999000, cat: "Laptop", desc: "Laptop konten kreator budget, RTX 3050." },
    { name: "ASUS Vivobook Go 14", price: 6299000, cat: "Laptop", desc: "Ryzen 3 7320U, Laptop pelajar enteng." },
    
    // LENOVO
    { name: "Lenovo Legion 9i", price: 76999000, cat: "Laptop", desc: "Liquid Cooling System integrated, RTX 4090." },
    { name: "Lenovo Legion Pro 7i Gen 8", price: 46999000, cat: "Laptop", desc: "i9-13900HX, RTX 4080, PureSight Gaming." },
    { name: "Lenovo Legion Slim 7i", price: 27999000, cat: "Laptop", desc: "Tipis, Ringan, Powerful. RTX 4070." },
    { name: "Lenovo Legion Pro 5i", price: 23999000, cat: "Laptop", desc: "i7-13700HX, RTX 4060, Layar 240Hz." },
    { name: "Lenovo LOQ 15IRH8 (RTX 4060)", price: 16999000, cat: "Laptop", desc: "Gaming budget terbaik spek rata kanan." },
    { name: "Lenovo LOQ 15APH8 (Ryzen 7)", price: 15999000, cat: "Laptop", desc: "Varian Ryzen 7 7840HS, RTX 4050." },
    { name: "Lenovo Yoga Book 9i", price: 34999000, cat: "Laptop", desc: "Dual Screen OLED Multitasking beast." },
    { name: "Lenovo IdeaPad Slim 5", price: 10499000, cat: "Laptop", desc: "i5-13500H, Layar OLED, Tipis." },
    { name: "Lenovo ThinkPad X1 Carbon Gen 11", price: 32000000, cat: "Laptop", desc: "Laptop bisnis premium tahan banting." },
    
    // MSI
    { name: "MSI Titan GT77 HX", price: 89999000, cat: "Laptop", desc: "Mechanical Keyboard Cherry MX, 4K 144Hz." },
    { name: "MSI Raider GE78 HX", price: 54999000, cat: "Laptop", desc: "Mystic Light Bar, i9-13980HX." },
    { name: "MSI Vector GP68 HX", price: 29999000, cat: "Laptop", desc: "RTX 4080 termurah di pasaran." },
    { name: "MSI Katana 15 B13V", price: 18499000, cat: "Laptop", desc: "Keyboard 4-Zone RGB, i7-13620H." },
    { name: "MSI Cyborg 15", price: 11999000, cat: "Laptop", desc: "Translucent body design, RTX 4050." },
    { name: "MSI Thin GF63", price: 9499000, cat: "Laptop", desc: "Laptop gaming paling ringan dan murah." },
    { name: "MSI Modern 14 C13M", price: 6999000, cat: "Laptop", desc: "Laptop kuliah warna warni." },

    // ACER
    { name: "Acer Predator Helios 18", price: 59000000, cat: "Laptop", desc: "Layar besar 18 inch, cooling liquid metal." },
    { name: "Acer Predator Helios Neo 16", price: 20999000, cat: "Laptop", desc: "Best Seller i7-13700HX RTX 4060." },
    { name: "Acer Nitro V 15 (RTX 4050)", price: 14999000, cat: "Laptop", desc: "Upgrade dari versi RTX 2050." },
    { name: "Acer Nitro V 15 (RTX 2050)", price: 10999000, cat: "Laptop", desc: "Entry gaming sejuta umat." },
    { name: "Acer Swift Go 14 OLED", price: 13499000, cat: "Laptop", desc: "Intel Evo, Layar OLED 90Hz." },

    // HP & DELL
    { name: "HP Omen 16 Transcend", price: 26999000, cat: "Laptop", desc: "Warna putih bersih, layar Mini-LED." },
    { name: "HP Victus 16 (Ryzen 7)", price: 18999000, cat: "Laptop", desc: "Ryzen 7 7840HS, RTX 4060." },
    { name: "HP Victus 15 (i5)", price: 11499000, cat: "Laptop", desc: "Desain minimalis logo V." },
    { name: "Dell G15 Gaming 5530", price: 21999000, cat: "Laptop", desc: "Cooling system turunan Alienware." },
    { name: "Alienware m16 R1", price: 34999000, cat: "Laptop", desc: "Legendary design, build quality tank." },

    // APPLE & LOCAL
    { name: "MacBook Pro 16 M3 Max", price: 62999000, cat: "Laptop", desc: "Chip M3 Max, RAM 36GB, 1TB SSD." },
    { name: "MacBook Pro 14 M3 Pro", price: 35999000, cat: "Laptop", desc: "Space Black, M3 Pro Chip." },
    { name: "MacBook Air 15 M2", price: 22999000, cat: "Laptop", desc: "Layar besar, tipis, tanpa kipas." },
    { name: "MacBook Air 13 M1", price: 11999000, cat: "Laptop", desc: "Entry level macbook paling worth it." },
    { name: "Advan Pixelwar", price: 9599000, cat: "Laptop", desc: "Lokal pride, Ryzen 5 6600H, Layar 16:10." },
    { name: "Axioo Pongo 760", price: 15999000, cat: "Laptop", desc: "RTX 4060 termurah se-Indonesia." },
    { name: "Axioo Pongo 960", price: 19999000, cat: "Laptop", desc: "i9-13900H di laptop under 20jt." }
];

const cpus = [
    { name: "Intel Core i9-14900K", price: 10200000, cat: "Processor", desc: "24 Core 32 Thread, King of Desktop." },
    { name: "Intel Core i9-13900K", price: 9200000, cat: "Processor", desc: "Masih sangat powerful untuk workstation." },
    { name: "Intel Core i7-14700K", price: 7100000, cat: "Processor", desc: "20 Core, best for gaming & streaming." },
    { name: "Intel Core i7-13700F", price: 5800000, cat: "Processor", desc: "Versi tanpa iGPU, lebih dingin." },
    { name: "Intel Core i5-14600K", price: 5300000, cat: "Processor", desc: "Sweet spot overclocking gaming." },
    { name: "Intel Core i5-13500", price: 3900000, cat: "Processor", desc: "14 Core, best value productivity." },
    { name: "Intel Core i5-13400F", price: 3400000, cat: "Processor", desc: "Raja gaming mid-range." },
    { name: "Intel Core i5-12400F", price: 2100000, cat: "Processor", desc: "Budget king gen 12." },
    { name: "Intel Core i3-13100F", price: 1800000, cat: "Processor", desc: "4 Core 8 Thread kencang." },
    { name: "Intel Core i3-12100F", price: 1400000, cat: "Processor", desc: "Gaming 1 jutaan terbaik." },
    
    { name: "AMD Ryzen 9 7950X3D", price: 10900000, cat: "Processor", desc: "16 Core + 3D V-Cache." },
    { name: "AMD Ryzen 9 7900X", price: 7200000, cat: "Processor", desc: "12 Core 24 Thread workhorse." },
    { name: "AMD Ryzen 7 7800X3D", price: 6800000, cat: "Processor", desc: "FPS Gaming tertinggi di dunia." },
    { name: "AMD Ryzen 7 5800X3D", price: 5200000, cat: "Processor", desc: "Upgrade path terbaik AM4." },
    { name: "AMD Ryzen 7 5700X", price: 2900000, cat: "Processor", desc: "8 Core hemat daya." },
    { name: "AMD Ryzen 5 7600X", price: 3800000, cat: "Processor", desc: "6 Core AM5 kencang." },
    { name: "AMD Ryzen 5 7500F", price: 2800000, cat: "Processor", desc: "Versi hemat tanpa iGPU AM5." },
    { name: "AMD Ryzen 5 5600", price: 1900000, cat: "Processor", desc: "Legenda budget gaming AM4." },
    { name: "AMD Ryzen 5 5600G", price: 1950000, cat: "Processor", desc: "Grafis bawaan kencang." },
    { name: "AMD Ryzen 5 5500", price: 1400000, cat: "Processor", desc: "6 Core termurah." }
];

const gpus = [
    // RTX 40 Series
    { name: "ASUS ROG Strix RTX 4090 OC", price: 38500000, cat: "Graphic Card", desc: "24GB. The King." },
    { name: "MSI RTX 4090 Gaming X Slim", price: 34500000, cat: "Graphic Card", desc: "24GB. Versi lebih tipis." },
    { name: "Gigabyte RTX 4080 Super Gaming OC", price: 21500000, cat: "Graphic Card", desc: "16GB. 4K Gaming monster." },
    { name: "Zotac RTX 4070 Ti Super Trinity", price: 15200000, cat: "Graphic Card", desc: "16GB VRAM upgrade." },
    { name: "ASUS TUF RTX 4070 Super", price: 12500000, cat: "Graphic Card", desc: "Best value 1440p." },
    { name: "Colorful RTX 4060 Ti Ultra W", price: 6900000, cat: "Graphic Card", desc: "8GB. Desain Putih." },
    { name: "MSI RTX 4060 Ventus 2X", price: 4900000, cat: "Graphic Card", desc: "8GB. Hemat daya." },
    { name: "Zotac RTX 4060 Solo", price: 4700000, cat: "Graphic Card", desc: "Single fan untuk ITX." },
    
    // RTX 30 Series (Masih Laku)
    { name: "ASUS KO RTX 3060 Ti", price: 5800000, cat: "Graphic Card", desc: "8GB GDDR6X." },
    { name: "Inno3D RTX 3060 Twin X2 12GB", price: 4300000, cat: "Graphic Card", desc: "12GB VRAM besar." },
    { name: "MSI RTX 3050 Ventus 2X 8GB", price: 3500000, cat: "Graphic Card", desc: "Entry Ray Tracing." },
    { name: "Zotac GTX 1650 AMP", price: 2300000, cat: "Graphic Card", desc: "Tanpa pin power tambahan." },
    
    // RADEON
    { name: "PowerColor RX 7900 XTX Red Devil", price: 20500000, cat: "Graphic Card", desc: "24GB. Rasterisasi monster." },
    { name: "Sapphire Nitro+ RX 7800 XT", price: 9800000, cat: "Graphic Card", desc: "16GB. Pesaing RTX 4070." },
    { name: "ASRock RX 7700 XT Challenger", price: 7500000, cat: "Graphic Card", desc: "12GB. 1440p Budget." },
    { name: "Sapphire Pulse RX 7600", price: 4500000, cat: "Graphic Card", desc: "8GB. 1080p Ultra." },
    { name: "ASRock RX 6600 Challenger", price: 3100000, cat: "Graphic Card", desc: "Best Value GPU under 4jt." },
    
    // INTEL ARC
    { name: "Intel Arc A770 Phantom Gaming", price: 5900000, cat: "Graphic Card", desc: "16GB VRAM termurah." },
    { name: "Intel Arc A750 Limited", price: 3800000, cat: "Graphic Card", desc: "Alternatif RX 6600." },
    { name: "Intel Arc A380 Elf", price: 1800000, cat: "Graphic Card", desc: "Untuk encoding AV1." }
];

const motherboards = [
    // INTEL
    { name: "ASUS ROG Maximus Z790 Dark Hero", price: 12500000, cat: "Motherboard", desc: "Flagship LGA1700." },
    { name: "MSI MPG Z790 Edge WIFI", price: 6500000, cat: "Motherboard", desc: "Silver White design." },
    { name: "Gigabyte Z790 Aorus Elite", price: 5200000, cat: "Motherboard", desc: "Best value seri Z." },
    { name: "ASUS TUF Gaming B760-Plus WIFI", price: 3500000, cat: "Motherboard", desc: "Durabilitas tinggi." },
    { name: "MSI MAG B760M Mortar II", price: 3200000, cat: "Motherboard", desc: "M-ATX feature rich." },
    { name: "ASRock B760M Pro RS/D4", price: 2100000, cat: "Motherboard", desc: "Support RAM DDR4 murah." },
    { name: "Gigabyte H610M H", price: 1300000, cat: "Motherboard", desc: "LGA1700 termurah." },
    
    // AMD
    { name: "ASUS ROG Crosshair X670E Gene", price: 9500000, cat: "Motherboard", desc: "M-ATX Overclocking board." },
    { name: "ASRock X670E Steel Legend", price: 5500000, cat: "Motherboard", desc: "Fitur PCIe Gen 5." },
    { name: "Gigabyte B650 Aorus Elite AX", price: 3900000, cat: "Motherboard", desc: "Sweetspot AM5." },
    { name: "MSI MAG B650M Mortar WIFI", price: 3400000, cat: "Motherboard", desc: "VRM Kuat." },
    { name: "ASRock B650M-HDV/M.2", price: 2000000, cat: "Motherboard", desc: "AM5 Budget King." },
    { name: "MSI B550M Mortar", price: 2600000, cat: "Motherboard", desc: "AM4 High End." },
    { name: "ASRock B550M Phantom Gaming 4", price: 1600000, cat: "Motherboard", desc: "AM4 Mid range." },
    { name: "ASUS Prime A320M-K", price: 850000, cat: "Motherboard", desc: "Mobo sejuta umat warnet." }
];

const rams = [
    // DDR5
    { name: "G.Skill Trident Z5 RGB 32GB (2x16) 6000MHz", price: 2500000, cat: "RAM", desc: "DDR5 Paling populer." },
    { name: "G.Skill Trident Z5 Royal 32GB 6400MHz", price: 3200000, cat: "RAM", desc: "Desain kristal mewah." },
    { name: "Corsair Dominator Titanium 32GB 6600MHz", price: 3800000, cat: "RAM", desc: "Top tier Corsair." },
    { name: "TeamGroup Delta RGB 32GB 6000MHz White", price: 1950000, cat: "RAM", desc: "RGB lebar 120 derajat." },
    { name: "ADATA XPG Lancer Blade 32GB 6000MHz", price: 1850000, cat: "RAM", desc: "Low profile DDR5." },
    { name: "Kingston FURY Beast DDR5 16GB (2x8) 5200MHz", price: 1200000, cat: "RAM", desc: "Entry level DDR5." },
    
    // DDR4
    { name: "Corsair Vengeance RGB RS 16GB (2x8) 3200MHz", price: 950000, cat: "RAM", desc: "DDR4 RGB Best Seller." },
    { name: "Corsair Vengeance LPX 16GB (2x8) 3200MHz", price: 850000, cat: "RAM", desc: "Low profile tanpa RGB." },
    { name: "G.Skill Trident Z Neo 32GB (2x16) 3600MHz", price: 1800000, cat: "RAM", desc: "Optimized for Ryzen AM4." },
    { name: "TeamGroup T-Force Dark Za 16GB 3600MHz", price: 800000, cat: "RAM", desc: "Polosan performa tinggi." },
    { name: "Kingston FURY Beast 8GB 3200MHz", price: 350000, cat: "RAM", desc: "Single stick hemat." },
    { name: "Klevv Bolt X 16GB (2x8) 3200MHz", price: 750000, cat: "RAM", desc: "Budget kit dual channel." }
];

const storage = [
    // NVMe High End
    { name: "Samsung 990 Pro 2TB Heatsink", price: 3600000, cat: "SSD/Storage", desc: "The fastest, PS5 compatible." },
    { name: "Samsung 990 Pro 1TB", price: 2100000, cat: "SSD/Storage", desc: "Speed 7450 MB/s." },
    { name: "WD Black SN850X 2TB", price: 3100000, cat: "SSD/Storage", desc: "Game Mode 2.0." },
    { name: "WD Black SN850X 1TB", price: 1800000, cat: "SSD/Storage", desc: "Gaming storage." },
    { name: "Seagate FireCuda 530 2TB", price: 3800000, cat: "SSD/Storage", desc: "High endurance TBW." },
    
    // NVMe Mid/Budget
    { name: "Kingston KC3000 1TB", price: 1600000, cat: "SSD/Storage", desc: "Alternatif 980 Pro." },
    { name: "ADATA XPG SX8200 Pro 1TB", price: 1100000, cat: "SSD/Storage", desc: "Legenda PCIe 3.0." },
    { name: "ADATA XPG SX8200 Pro 512GB", price: 700000, cat: "SSD/Storage", desc: "Versi 512GB." },
    { name: "Kingston NV2 1TB", price: 950000, cat: "SSD/Storage", desc: "PCIe 4.0 termurah." },
    { name: "Kingston NV2 500GB", price: 600000, cat: "SSD/Storage", desc: "Cukup untuk OS." },
    { name: "WD Blue SN580 1TB", price: 1050000, cat: "SSD/Storage", desc: "Blue rasa Black." },
    
    // SATA & HDD
    { name: "Samsung 870 EVO 500GB", price: 800000, cat: "SSD/Storage", desc: "SATA SSD paling awet." },
    { name: "WD Blue 4TB HDD", price: 1500000, cat: "SSD/Storage", desc: "Gudang data film." },
    { name: "Seagate BarraCuda 2TB HDD", price: 900000, cat: "SSD/Storage", desc: "HDD standar PC." },
    { name: "Seagate SkyHawk 4TB", price: 1600000, cat: "SSD/Storage", desc: "Khusus CCTV 24jam." }
];

const cases = [
    { name: "NZXT H9 Flow White", price: 2800000, cat: "Casing PC", desc: "Dual Chamber Glass." },
    { name: "NZXT H9 Flow Black", price: 2800000, cat: "Casing PC", desc: "Varian warna hitam." },
    { name: "NZXT H6 Flow RGB", price: 2100000, cat: "Casing PC", desc: "Sudut miring airflow unik." },
    { name: "NZXT H5 Flow", price: 1450000, cat: "Casing PC", desc: "Compact ATX ada kipas GPU." },
    { name: "Lian Li O11 Dynamic Evo XL", price: 4200000, cat: "Casing PC", desc: "Super besar full tower." },
    { name: "Lian Li O11 Dynamic Evo", price: 2900000, cat: "Casing PC", desc: "Favorit watercooling." },
    { name: "Hyte Y60 White", price: 3200000, cat: "Casing PC", desc: "Sudut kaca estetik." },
    { name: "Hyte Y70 Touch", price: 6500000, cat: "Casing PC", desc: "Ada layar touch screen 4K." },
    { name: "Fractal North Charcoal", price: 2500000, cat: "Casing PC", desc: "Panel kayu walnut asli." },
    { name: "Corsair 4000D Airflow Black", price: 1350000, cat: "Casing PC", desc: "Manajemen kabel terbaik." },
    { name: "Montech Sky Two Blue", price: 1300000, cat: "Casing PC", desc: "Warna biru morocco." },
    { name: "Phanteks NV7", price: 3500000, cat: "Casing PC", desc: "Showcase tanpa pilar." },
    { name: "Jonsbo D300 Black", price: 1200000, cat: "Casing PC", desc: "Curved glass." },
    { name: "Cube Gaming Axel", price: 450000, cat: "Casing PC", desc: "M-ATX budget." },
    { name: "Fantech Aero CG80", price: 550000, cat: "Casing PC", desc: "Sudah dapat 4 fan RGB." },
    { name: "Paradox Gaming Trickster", price: 650000, cat: "Casing PC", desc: "Cloning O11 murah." }
];

const monitors = [
    // High End
    { name: "Samsung Odyssey G9 OLED", price: 24999000, cat: "Monitor", desc: "49 inch Super Ultrawide." },
    { name: "Samsung Odyssey Neo G9", price: 29000000, cat: "Monitor", desc: "Mini LED 240Hz." },
    { name: "LG UltraGear 45GR95QE", price: 22000000, cat: "Monitor", desc: "45 inch OLED Curved." },
    { name: "BenQ Zowie XL2566K", price: 11000000, cat: "Monitor", desc: "360Hz DyAc+ Esports King." },
    
    // Mid Range
    { name: "Samsung Odyssey G5 27 inch", price: 4500000, cat: "Monitor", desc: "1440p Curved 144Hz." },
    { name: "LG UltraGear 27GP850", price: 6200000, cat: "Monitor", desc: "Nano IPS 1440p 180Hz." },
    { name: "ASUS TUF VG27AQ", price: 5100000, cat: "Monitor", desc: "Monitor wajib reviewer." },
    { name: "BenQ Zowie XL2546K", price: 8500000, cat: "Monitor", desc: "240Hz Standar turnamen." },
    { name: "Xiaomi Curved Gaming 34", price: 5500000, cat: "Monitor", desc: "Ultrawide termurah." },
    
    // Budget
    { name: "AOC 24G2SP", price: 2100000, cat: "Monitor", desc: "165Hz IPS Best Seller." },
    { name: "ViewSonic VX2428", price: 1800000, cat: "Monitor", desc: "180Hz IPS termurah." },
    { name: "KOORUI 24E3", price: 1500000, cat: "Monitor", desc: "Monitor gaming termurah." },
    { name: "MSI G244F", price: 2000000, cat: "Monitor", desc: "Warna vivid khas MSI." },
    { name: "Samsung T350 24 inch", price: 1400000, cat: "Monitor", desc: "Monitor kerja IPS 75Hz." }
];

const gear = [
    // MICE
    { name: "Logitech G Pro X Superlight 2 Black", price: 2300000, cat: "Gaming Gear", desc: "Mouse wireless 60g." },
    { name: "Logitech G Pro X Superlight 2 White", price: 2300000, cat: "Gaming Gear", desc: "Varian warna putih." },
    { name: "Razer DeathAdder V3 Pro", price: 2500000, cat: "Gaming Gear", desc: "Ergonomi tangan kanan terbaik." },
    { name: "Razer Viper V2 Pro", price: 2100000, cat: "Gaming Gear", desc: "Shape ambidextrous flat." },
    { name: "Logitech G502 X Plus", price: 2100000, cat: "Gaming Gear", desc: "Banyak tombol RGB." },
    { name: "Fantech Helios II Pro XD3 V3", price: 850000, cat: "Gaming Gear", desc: "Mouse lokal spek dewa." },
    { name: "VGN Dragonfly F1 Moba", price: 750000, cat: "Gaming Gear", desc: "Mouse china viral." },
    { name: "Razer Cobra", price: 600000, cat: "Gaming Gear", desc: "Mouse kecil kabel." },
    
    // KEYBOARDS
    { name: "Wooting 60HE+", price: 3500000, cat: "Gaming Gear", desc: "Rapid trigger analog switch." },
    { name: "Corsair K70 MAX RGB", price: 3200000, cat: "Gaming Gear", desc: "Magnetic switch premium." },
    { name: "Keychron Q1 Pro", price: 3100000, cat: "Gaming Gear", desc: "Custom mechanical prebuilt." },
    { name: "Keychron K2 Pro", price: 1800000, cat: "Gaming Gear", desc: "Wireless 75% solid." },
    { name: "Royal Kludge RK61", price: 650000, cat: "Gaming Gear", desc: "Keyboard budget wireless." },
    { name: "Fantech Maxfit67", price: 900000, cat: "Gaming Gear", desc: "Ada knob volume." },
    { name: "VortexSeries GT-65", price: 850000, cat: "Gaming Gear", desc: "Lokal pride alu plate." },
    
    // HEADSETS & MIC
    { name: "SteelSeries Arctis Nova Pro Wireless", price: 5800000, cat: "Gaming Gear", desc: "ANC Gaming headset." },
    { name: "Logitech G733 White", price: 1800000, cat: "Gaming Gear", desc: "Headset ringan RGB." },
    { name: "HyperX Cloud II", price: 1200000, cat: "Gaming Gear", desc: "Headset paling nyaman." },
    { name: "Razer BlackShark V2 Pro (2023)", price: 2800000, cat: "Gaming Gear", desc: "Mic quality terbaik." },
    { name: "Fifine AM8", price: 850000, cat: "Gaming Gear", desc: "Mic dynamic USB/XLR." },
    { name: "HyperX QuadCast S", price: 2100000, cat: "Gaming Gear", desc: "Mic streamer RGB." }
];

const psus = [
    { name: "Corsair RM1000x Shift", price: 3200000, cat: "Power Supply", desc: "Konektor di samping unik." },
    { name: "Corsair RM850e Gold", price: 2100000, cat: "Power Supply", desc: "ATX 3.0 Ready." },
    { name: "ASUS ROG Thor 1000W P2", price: 5500000, cat: "Power Supply", desc: "Layar OLED pantau daya." },
    { name: "Seasonic Focus GX-850", price: 2200000, cat: "Power Supply", desc: "Brand PSU terpercaya." },
    { name: "MSI MPG A850G", price: 2100000, cat: "Power Supply", desc: "Native 12VHPWR cable." },
    { name: "FSP Hydro G Pro 850W", price: 1900000, cat: "Power Supply", desc: "Anti lembab coating." },
    { name: "MSI MAG A650BN", price: 850000, cat: "Power Supply", desc: "Tier C aman budget." },
    { name: "FSP HV PRO 550W", price: 600000, cat: "Power Supply", desc: "Entry level PSU." },
    { name: "Cooler Master MWE 550 V2", price: 750000, cat: "Power Supply", desc: "Kabel hitam flat." }
];

const coolers = [
    { name: "NZXT Kraken Elite 360 RGB", price: 4800000, cat: "Cooling", desc: "Layar LCD custom GIF." },
    { name: "Corsair iCUE H150i Elite LCD", price: 4200000, cat: "Cooling", desc: "Ekosistem iCUE." },
    { name: "Lian Li Galahad II LCD", price: 3800000, cat: "Cooling", desc: "Fan daisy chain." },
    { name: "Deepcool LT720", price: 2100000, cat: "Cooling", desc: "Performa tinggi harga miring." },
    { name: "Arctic Liquid Freezer III 360", price: 1800000, cat: "Cooling", desc: "VRM Fan included." },
    { name: "Noctua NH-D15 Chromax Black", price: 1900000, cat: "Cooling", desc: "Air cooler performa AIO." },
    { name: "Deepcool AK620 Digital", price: 1100000, cat: "Cooling", desc: "Indikator suhu di tower." },
    { name: "Deepcool AK400", price: 450000, cat: "Cooling", desc: "Cukup untuk i5/Ryzen 5." },
    { name: "Thermalright Peerless Assassin 120", price: 650000, cat: "Cooling", desc: "Dual tower termurah." },
    { name: "ID-Cooling SE-224-XTS", price: 350000, cat: "Cooling", desc: "Raja cooler budget." }
];

// Gabungkan Semua Array
const allRealProducts = [
    ...laptops,
    ...cpus,
    ...gpus,
    ...motherboards,
    ...rams,
    ...storage,
    ...cases,
    ...monitors,
    ...gear,
    ...psus,
    ...coolers
];

const randomStock = () => Math.floor(Math.random() * 100) + 1;

const seed = async () => {
    try {
        await db.sync({ force: true });
        console.log("♻️  Database lama dihapus...");
        console.log(`📊 Menyiapkan ${allRealProducts.length} Data Produk Unik...`);
        
        // Map data
        const finalData = allRealProducts.map(item => {
            // Buat URL gambar dummy dari nama produk (3 kata pertama)
            const imgName = item.name.split(' ').slice(0, 3).join('+');
            
            return {
                productName: item.name,
                category: item.cat,
                price: item.price,
                stock: randomStock(),
                description: item.desc,
                image: `https://placehold.co/600x400/2563eb/FFF?text=${imgName}`
            };
        });

        await Product.bulkCreate(finalData);
        
        console.log(`✅ SUKSES! Total ${finalData.length} Data Real World berhasil dimasukkan.`);
        console.log("➡️  Jangan lupa restart server utama: 'node index.js'");
        
        // Verifikasi jumlah kategori
        const counts = {};
        finalData.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
        console.table(counts); // Tampilkan tabel jumlah per kategori di console
        
        process.exit();
    } catch (err) {
        console.error("❌ Gagal Seeding:", err);
    }
};

seed();