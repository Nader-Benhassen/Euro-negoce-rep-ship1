"use client"

import { useState, useEffect } from "react"
import {
  Star,
  Quote,
  Mail,
  FileText,
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Heart,
  Building,
  Phone,
  Eye,
  Search,
} from "lucide-react"
import ContactModal from "./contact-modal"
import ProductsModal from "./products-modal"
import Header from "./header"
import CookieConsent from "./cookie-consent"
import GlobalOperationsSection from "./global-operations-section"
import ImprintModal from "./imprint-modal"
import ProductDetailModal from "./product-detail-modal"
import { useMediaQuery } from "../../hooks/use-media-query"
import AppointmentScheduler from "./appointment-scheduler"
import ChatBot from "./chatbot/chat-bot"

// Translation hook
const useTranslation = () => {
  const [language, setLanguage] = useState("en")

  const translations = {
    en: {
      headerTitle: "Euro Negoce",
      hero_title: "Bridging Continents with Quality Goods",
      hero_subtitle:
        "Euro Negoce is a premier international trade company specializing in the import and export of high-quality fresh fruits, vegetables, and premium edible oils — tailored for both wholesale and retail markets.",
      hero_cta: "Request a Quote",
      hero_view_products: "View Products",
      hero_schedule_call: "Schedule a Call",
      gallery_title: "Product Gallery",
      gallery_subtitle: "Explore our premium selection of fresh produce and edible oils",
      stats_clients: "Happy Clients",
      stats_countries: "Countries Served",
      stats_tons: "Tons Exported",
      stats_delivery: "On-Time Delivery",
    },
  }

  const t = (key: string) => translations[language][key as keyof typeof translations.en] || key
  const changeLanguage = (lng: string) => setLanguage(lng)

  return { t, i18n: { language, changeLanguage } }
}

// Hero Section
function Hero({
  showContactModal,
  setShowContactModal,
  showProductsModal,
  setShowProductsModal,
  showScheduler,
  setShowScheduler,
}: {
  showContactModal: boolean
  setShowContactModal: (show: boolean) => void
  showProductsModal: boolean
  setShowProductsModal: (show: boolean) => void
  showScheduler: boolean
  setShowScheduler: (show: boolean) => void
}) {
  const { t } = useTranslation()
  const isMobile = useMediaQuery("(max-width: 640px)")

  return (
    <section
      id="about"
      className="bg-gradient-to-br from-green-100 via-blue-50 to-green-50 pt-16 sm:pt-20 md:pt-24 pb-24 sm:pb-32 md:pb-48 text-center relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent px-2">
          {t("hero_title")}
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-3xl mx-auto text-gray-700 mb-6 sm:mb-8 px-4">
          {t("hero_subtitle")}
        </p>
        <div className="space-y-4 mb-16">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-2xl mx-auto">
            <button
              onClick={() => setShowContactModal(true)}
              className="w-full sm:w-auto bg-green-600 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-xs sm:text-sm md:text-base lg:text-lg min-w-[160px] sm:min-w-[180px] md:min-w-[200px]"
              aria-label="Request a quote for our products"
            >
              {t("hero_cta")}
            </button>
            <button
              onClick={() => setShowProductsModal(true)}
              className="w-full sm:w-auto bg-white text-green-600 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-green-600 hover:border-green-700 font-semibold text-xs sm:text-sm md:text-base lg:text-lg min-w-[160px] sm:min-w-[180px] md:min-w-[200px]"
              aria-label="View our product catalog"
            >
              {t("hero_view_products")}
            </button>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => setShowScheduler(true)}
              className="w-full sm:w-auto bg-blue-600 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-xs sm:text-sm md:text-base lg:text-lg min-w-[160px] sm:min-w-[180px] md:min-w-[200px] flex items-center gap-2 justify-center max-w-xs mx-auto"
              aria-label="Schedule a call with our team"
            >
              <Phone size={isMobile ? 16 : 18} />
              {t("hero_schedule_call")}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// Product Gallery Component
function ProductGallery() {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const isMobile = useMediaQuery("(max-width: 640px)")

  const products = [
    // Oils - at the beginning as requested
    {
      id: "olive-oil",
      name: "Extra Virgin Olive Oil",
      category: "oils",
      image: "/images/products/olive-oil.jpeg",
      description: "Cold-pressed olive oil from century-old Mediterranean trees",
      origin: "Tunisia",
      season: "Year-round",
      certifications: ["Origin Control", "HACCP", "BIO"],
      detailedDescription:
        "Our premium extra virgin olive oil is cold-pressed from carefully selected olives grown in century-old groves across Tunisia. Each batch is tested for quality and purity, ensuring the highest standards of flavor and nutritional value.",
      nutritionalInfo: {
        calories: "884 kcal/100ml",
        protein: "0g",
        carbs: "0g",
        fiber: "0g",
        vitamins: ["Vitamin E", "Vitamin K", "Antioxidants"],
      },
      shelfLife: "24 months from production date",
      storageConditions: "Store in cool, dark place away from direct sunlight",
      harvestMethod: "Hand-picked and cold-pressed within 24 hours",
    },
    {
      id: "rapeseed-oil",
      name: "Premium Rapeseed Oil",
      category: "oils",
      image: "/images/products/rapeseed-oil-field.jpeg",
      description: "High-quality rapeseed oil with excellent cooking properties",
      origin: "Tunisia",
      season: "Year-round",
      certifications: ["Origin Control", "HACCP"],
      detailedDescription:
        "Premium rapeseed oil extracted from high-quality Tunisian rapeseed. Known for its neutral taste and high smoke point, making it perfect for cooking and food preparation.",
      nutritionalInfo: {
        calories: "884 kcal/100ml",
        protein: "0g",
        carbs: "0g",
        fiber: "0g",
        vitamins: ["Vitamin E", "Omega-3", "Omega-6"],
      },
      shelfLife: "18 months from production date",
      storageConditions: "Store in cool, dry place",
      harvestMethod: "Mechanically harvested and processed",
    },
    // Fruits
    {
      id: "apples",
      name: "Fresh Apples",
      category: "fruits",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Apples.jpg-HsVvufZ3nuLurZH0h1iX9HVPUYJOCH.webp",
      description: "Crisp and sweet apples from selected orchards",
      origin: "Tunisia",
      season: "September to April",
      certifications: ["Global GAP"],
      detailedDescription:
        "Our premium apples are carefully selected from the finest orchards in Tunisia. Known for their crisp texture, sweet flavor, and excellent keeping quality, they're perfect for both direct consumption and culinary applications.",
      nutritionalInfo: {
        calories: "52 kcal/100g",
        protein: "0.3g",
        carbs: "14g",
        fiber: "2.4g",
        vitamins: ["Vitamin C", "Potassium", "Antioxidants"],
      },
      shelfLife: "Up to 4 weeks when refrigerated",
      storageConditions: "Store in cool, dry place or refrigerate",
      harvestMethod: "Hand-picked at optimal ripeness",
    },
    {
      id: "pears",
      name: "Premium Pears",
      category: "fruits",
      image: "/images/products/pears.png",
      description: "Sweet and juicy pears with excellent texture",
      origin: "Tunisia",
      season: "August to January",
      certifications: ["Global GAP"],
      detailedDescription:
        "Our premium pears are sourced from select Tunisian orchards. They offer a perfect balance of sweetness and juiciness with a buttery texture that makes them ideal for fresh consumption or gourmet preparations.",
      nutritionalInfo: {
        calories: "57 kcal/100g",
        protein: "0.4g",
        carbs: "15g",
        fiber: "3.1g",
        vitamins: ["Vitamin C", "Vitamin K", "Copper"],
      },
      shelfLife: "Up to 2 weeks when refrigerated",
      storageConditions: "Store at room temperature until ripe, then refrigerate",
      harvestMethod: "Carefully hand-picked to prevent bruising",
    },
    {
      id: "peaches",
      name: "Juicy Peaches",
      category: "fruits",
      image: "/images/products/peaches.png",
      description: "Sweet, aromatic peaches with velvety skin",
      origin: "Tunisia",
      season: "May to September",
      certifications: ["Global GAP"],
      detailedDescription:
        "Our peaches are sourced from the sunny orchards of Tunisia, where the perfect climate produces exceptionally sweet and aromatic fruit. Each peach offers a perfect balance of sweetness and juiciness with a delightful fragrance.",
      nutritionalInfo: {
        calories: "39 kcal/100g",
        protein: "0.9g",
        carbs: "9.5g",
        fiber: "1.5g",
        vitamins: ["Vitamin A", "Vitamin C", "Potassium"],
      },
      shelfLife: "3-5 days at room temperature, 1-2 weeks refrigerated",
      storageConditions: "Store at room temperature until ripe, then refrigerate",
      harvestMethod: "Hand-picked at optimal ripeness",
    },
    {
      id: "oranges",
      name: "Fresh Oranges",
      category: "fruits",
      image: "/images/products/oranges.png",
      description: "Juicy and sweet oranges packed with vitamin C",
      origin: "Tunisia and Spain",
      season: "November to May",
      certifications: ["Global GAP"],
      detailedDescription:
        "Our premium oranges are sourced from the Mediterranean coasts of Tunisia and Spain. These oranges are known for their exceptional sweetness, juiciness, and high vitamin C content.",
      nutritionalInfo: {
        calories: "47 kcal/100g",
        protein: "0.9g",
        carbs: "12g",
        fiber: "2.4g",
        vitamins: ["Vitamin C", "Folate", "Potassium"],
      },
      shelfLife: "2-3 weeks when refrigerated",
      storageConditions: "Store in cool place or refrigerate",
      harvestMethod: "Hand-picked at peak ripeness",
    },
    {
      id: "strawberries",
      name: "Fresh Strawberries",
      category: "fruits",
      image: "/images/products/strawberries.png",
      description: "Sweet and fragrant strawberries with vibrant color",
      origin: "Tunisia",
      season: "March to June",
      certifications: ["Global GAP"],
      detailedDescription:
        "Our strawberries are carefully cultivated in the optimal climate of Tunisia. Known for their intense sweetness, vibrant red color, and delightful aroma.",
      nutritionalInfo: {
        calories: "32 kcal/100g",
        protein: "0.7g",
        carbs: "8g",
        fiber: "2g",
        vitamins: ["Vitamin C", "Manganese", "Antioxidants"],
      },
      shelfLife: "3-5 days refrigerated",
      storageConditions: "Store in refrigerator",
      harvestMethod: "Hand-picked daily at peak ripeness",
    },
    {
      id: "watermelon",
      name: "Sweet Watermelon",
      category: "fruits",
      image: "/images/products/watermelon.png",
      description: "Refreshing watermelons with crisp, sweet flesh",
      origin: "Tunisia",
      season: "June to September",
      certifications: ["Global GAP"],
      detailedDescription:
        "Our watermelons are grown in the warm Mediterranean climate of Tunisia, producing exceptionally sweet and refreshing fruit perfect for summer consumption.",
      nutritionalInfo: {
        calories: "30 kcal/100g",
        protein: "0.6g",
        carbs: "8g",
        fiber: "0.4g",
        vitamins: ["Vitamin A", "Vitamin C", "Lycopene"],
      },
      shelfLife: "1-2 weeks at room temperature",
      storageConditions: "Store in cool, dry place",
      harvestMethod: "Hand-selected for optimal ripeness",
    },
    {
      id: "melon",
      name: "Sweet Melon",
      category: "fruits",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/thumbnail__23459.jpg-3MM1qvLKAtel2CP16QcZgxz9FGGVu0.jpeg",
      description: "Aromatic melons with sweet, tender flesh",
      origin: "Tunisia",
      season: "June to September",
      certifications: ["Global GAP"],
      detailedDescription:
        "Our melons are carefully selected from Tunisian farms known for producing exceptionally sweet and aromatic fruit with perfect texture.",
      nutritionalInfo: {
        calories: "34 kcal/100g",
        protein: "0.8g",
        carbs: "8g",
        fiber: "0.9g",
        vitamins: ["Vitamin A", "Vitamin C", "Potassium"],
      },
      shelfLife: "5-7 days at room temperature",
      storageConditions: "Store at room temperature until ripe",
      harvestMethod: "Hand-picked at optimal maturity",
    },
    {
      id: "pineapple",
      name: "Tropical Pineapple",
      category: "fruits",
      image: "/images/products/pineapple.png",
      description: "Sweet and tangy pineapples with tropical flavor",
      origin: "Ghana and Ivory Coast",
      season: "Year-round",
      certifications: ["Rainforest Alliance"],
      detailedDescription:
        "Our pineapples are sourced from sustainable farms in Ghana and Ivory Coast, known for their perfect balance of sweetness and acidity with intense tropical flavor.",
      nutritionalInfo: {
        calories: "50 kcal/100g",
        protein: "0.5g",
        carbs: "13g",
        fiber: "1.4g",
        vitamins: ["Vitamin C", "Manganese", "Bromelain"],
      },
      shelfLife: "3-5 days at room temperature when ripe",
      storageConditions: "Store at room temperature until ripe, then refrigerate",
      harvestMethod: "Hand-harvested at peak ripeness",
    },
    {
      id: "dragon-fruit",
      name: "Exotic Dragon Fruit",
      category: "fruits",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fc1a7207fc284694d442a927551423f9-lGpqv8YhY4mHvHoJkWiVJbwVSslj2N.avif",
      description: "Exotic dragon fruit with unique appearance and mild flavor",
      origin: "Tunisia",
      season: "Year-round",
      certifications: ["Global GAP"],
      detailedDescription:
        "Our dragon fruit is sourced from specialized farms in Tunisia. This exotic fruit offers a unique appearance with mild, refreshing flavor and numerous health benefits.",
      nutritionalInfo: {
        calories: "60 kcal/100g",
        protein: "1.2g",
        carbs: "13g",
        fiber: "3g",
        vitamins: ["Vitamin C", "Iron", "Magnesium"],
      },
      shelfLife: "5-7 days refrigerated",
      storageConditions: "Store in refrigerator",
      harvestMethod: "Hand-picked when fully colored",
    },
    // Vegetables
    {
      id: "artichoke",
      name: "Fresh Artichokes",
      category: "vegetables",
      image: "/images/products/artichoke.png",
      description: "Tender artichokes with excellent flavor and texture",
      origin: "Tunisia",
      season: "March to May (Spring), September to October (Fall)",
      certifications: ["Global GAP"],
      detailedDescription:
        "Our premium artichokes are sourced from specialized farms in Tunisia. Known for their tender hearts and excellent flavor, they're perfect for Mediterranean cuisine and gourmet preparations.",
      nutritionalInfo: {
        calories: "47 kcal/100g",
        protein: "3.3g",
        carbs: "10.5g",
        fiber: "5.4g",
        vitamins: ["Vitamin C", "Vitamin K", "Folate", "Magnesium"],
      },
      shelfLife: "5-7 days refrigerated",
      storageConditions: "Store in the refrigerator in a plastic bag",
      harvestMethod: "Hand-harvested at optimal maturity",
    },
    {
      id: "baklouti-pepper",
      name: "Tunisian Baklouti Pepper",
      category: "vegetables",
      image: "/images/products/baklouti-pepper.png",
      description: "Traditional Tunisian hot pepper with distinctive flavor",
      origin: "Tunisia",
      season: "July to October",
      certifications: ["Origin Control"],
      detailedDescription:
        "The Baklouti pepper is a traditional Tunisian hot pepper variety, essential to authentic North African cuisine. It offers a distinctive flavor profile with moderate heat and complex fruity notes that enhance many traditional dishes.",
      nutritionalInfo: {
        calories: "40 kcal/100g",
        protein: "2g",
        carbs: "9g",
        fiber: "1.5g",
        vitamins: ["Vitamin A", "Vitamin C", "Capsaicin"],
      },
      shelfLife: "1-2 weeks refrigerated",
      storageConditions: "Store in the refrigerator in a paper bag",
      harvestMethod: "Hand-picked at peak ripeness",
    },
    {
      id: "bell-peppers",
      name: "Colorful Bell Peppers",
      category: "vegetables",
      image: "/images/products/bell-peppers.jpeg",
      description: "Sweet and crunchy bell peppers in various colors",
      origin: "Spain",
      season: "June to October",
      certifications: ["Global GAP"],
      detailedDescription:
        "Our bell peppers come in vibrant colors - red, yellow, and green. Grown in the optimal climate of Spain, they offer exceptional sweetness and crunch.",
      nutritionalInfo: {
        calories: "31 kcal/100g",
        protein: "1g",
        carbs: "7g",
        fiber: "2.5g",
        vitamins: ["Vitamin C", "Vitamin A", "Vitamin B6"],
      },
      shelfLife: "1-2 weeks refrigerated",
      storageConditions: "Store in refrigerator crisper drawer",
      harvestMethod: "Hand-picked at optimal color development",
    },
    {
      id: "potatoes",
      name: "Premium Potatoes",
      category: "vegetables",
      image: "/images/products/potatoes.jpeg",
      description: "High-quality potatoes perfect for various culinary uses",
      origin: "Tunisia and Egypt",
      season: "Year-round",
      certifications: ["Global GAP"],
      detailedDescription:
        "Our potatoes are sourced from the finest farms in Tunisia and Egypt. These versatile tubers are perfect for all cooking methods and offer excellent flavor and texture.",
      nutritionalInfo: {
        calories: "77 kcal/100g",
        protein: "2g",
        carbs: "17g",
        fiber: "2.2g",
        vitamins: ["Vitamin C", "Potassium", "Vitamin B6"],
      },
      shelfLife: "2-3 weeks in cool, dark place",
      storageConditions: "Store in cool, dark, well-ventilated place",
      harvestMethod: "Mechanically harvested at maturity",
    },
    {
      id: "garlic",
      name: "Fresh Garlic",
      category: "vegetables",
      image: "/images/products/garlic.png",
      description: "Aromatic garlic bulbs with intense flavor",
      origin: "Tunisia",
      season: "June to August",
      certifications: ["Global GAP"],
      detailedDescription:
        "Our garlic is sourced from Tunisian farms known for producing bulbs with intense flavor and excellent keeping quality. Essential for Mediterranean and international cuisine.",
      nutritionalInfo: {
        calories: "149 kcal/100g",
        protein: "6.4g",
        carbs: "33g",
        fiber: "2.1g",
        vitamins: ["Vitamin C", "Vitamin B6", "Manganese"],
      },
      shelfLife: "3-6 months in proper storage",
      storageConditions: "Store in cool, dry, well-ventilated place",
      harvestMethod: "Hand-harvested and cured",
    },
    // Legumes
    {
      id: "chickpeas",
      name: "Premium Chickpeas",
      category: "legumes",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/chickpeas.652d6f3ea08b0.png-1p77NFhkrDoUil3WZFJXmlmNWt7v8J.avif",
      description: "High-quality chickpeas perfect for various dishes",
      origin: "Tunisia",
      season: "Year-round (dried)",
      certifications: ["Organic"],
      detailedDescription:
        "Our chickpeas are sourced from Tunisia, known for producing some of the world's finest legumes. Perfect for hummus, stews, and Mediterranean cuisine.",
      nutritionalInfo: {
        calories: "164 kcal/100g",
        protein: "8.9g",
        carbs: "27g",
        fiber: "7.6g",
        vitamins: ["Folate", "Iron", "Phosphorus"],
      },
      shelfLife: "2-3 years when stored properly",
      storageConditions: "Store in cool, dry place in airtight container",
      harvestMethod: "Mechanically harvested and dried",
    },
    {
      id: "fava-beans",
      name: "Fresh Fava Beans",
      category: "legumes",
      image: "/images/products/fava-beans.png",
      description: "Tender fava beans with rich, nutty flavor",
      origin: "Tunisia",
      season: "April to June",
      certifications: ["Global GAP"],
      detailedDescription:
        "Our fava beans are sourced from Tunisian farms. These protein-rich legumes offer a rich, nutty flavor and are perfect for Mediterranean dishes.",
      nutritionalInfo: {
        calories: "88 kcal/100g",
        protein: "7.9g",
        carbs: "17g",
        fiber: "5.4g",
        vitamins: ["Folate", "Vitamin K", "Manganese"],
      },
      shelfLife: "3-5 days refrigerated in pods",
      storageConditions: "Store in refrigerator in pods until ready to use",
      harvestMethod: "Hand-picked when pods are plump",
    },
    // Nuts
    {
      id: "almonds",
      name: "Premium Almonds",
      category: "nuts",
      image: "/images/products/almonds.png",
      description: "High-quality almonds with excellent flavor and crunch",
      origin: "Tunisia",
      season: "Year-round",
      certifications: ["Organic"],
      detailedDescription:
        "Our almonds are sourced from the finest Tunisian orchards. Known for their excellent flavor, crunch, and nutritional value, they're perfect for snacking and culinary use.",
      nutritionalInfo: {
        calories: "579 kcal/100g",
        protein: "21g",
        carbs: "22g",
        fiber: "12g",
        vitamins: ["Vitamin E", "Magnesium", "Healthy Fats"],
      },
      shelfLife: "12 months in proper storage",
      storageConditions: "Store in cool, dry place in airtight container",
      harvestMethod: "Mechanically harvested and processed",
    },
    {
      id: "pistachios",
      name: "Premium Pistachios",
      category: "nuts",
      image: "/images/products/pistachios.png",
      description: "High-quality pistachios with rich flavor",
      origin: "Tunisia",
      season: "Year-round",
      certifications: ["Origin Control"],
      detailedDescription:
        "Our pistachios are sourced from Tunisia, renowned for producing some of the world's finest nuts. They offer exceptional flavor and are perfect for snacking and culinary applications.",
      nutritionalInfo: {
        calories: "560 kcal/100g",
        protein: "20g",
        carbs: "28g",
        fiber: "10g",
        vitamins: ["Vitamin B6", "Potassium", "Healthy Fats"],
      },
      shelfLife: "12 months in proper storage",
      storageConditions: "Store in cool, dry place in airtight container",
      harvestMethod: "Hand-harvested and processed",
    },
    {
      id: "peanuts",
      name: "Premium Peanuts",
      category: "nuts",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Roasted-Crunchy-sallted-peanuts.jpg-IKhUxwoLEKkj9JlmWc2SgV1Rl743Lh.webp",
      description: "High-quality peanuts with excellent flavor",
      origin: "Tunisia",
      season: "Year-round",
      certifications: ["HACCP"],
      detailedDescription:
        "Our peanuts are sourced from Tunisia, known for producing high-quality groundnuts. Perfect for snacking, cooking, and processing into peanut products.",
      nutritionalInfo: {
        calories: "567 kcal/100g",
        protein: "26g",
        carbs: "16g",
        fiber: "8.5g",
        vitamins: ["Niacin", "Folate", "Vitamin E"],
      },
      shelfLife: "12 months in proper storage",
      storageConditions: "Store in cool, dry place in airtight container",
      harvestMethod: "Mechanically harvested and processed",
    },
    {
      id: "dates",
      name: "Premium Dates",
      category: "fruits",
      image: "/images/products/dates.png",
      description: "Sweet and nutritious dates with rich flavor",
      origin: "Tunisia, Saudi Arabia and Algeria",
      season: "Year-round",
      certifications: ["Organic"],
      detailedDescription:
        "Our dates are sourced from the finest oases of Tunisia, Saudi Arabia, and Algeria, where the desert climate produces exceptionally sweet and flavorful fruit. Rich in natural sugars and nutrients.",
      nutritionalInfo: {
        calories: "277 kcal/100g",
        protein: "1.8g",
        carbs: "75g",
        fiber: "6.7g",
        vitamins: ["Potassium", "Copper", "Manganese"],
      },
      shelfLife: "12 months in proper storage",
      storageConditions: "Store in cool, dry place in airtight container",
      harvestMethod: "Hand-picked from date palms",
    },
  ]

  const categories = [
    { value: "all", label: "All Products", icon: "🌟" },
    { value: "oils", label: "Edible Oils", icon: "🫒" },
    { value: "fruits", label: "Fresh Fruits", icon: "🍎" },
    { value: "vegetables", label: "Vegetables", icon: "🥬" },
    { value: "legumes", label: "Legumes", icon: "🫘" },
    { value: "nuts", label: "Nuts", icon: "🥜" },
  ]

  const filteredProducts = products.filter((product) => {
    const categoryMatch = selectedCategory === "all" || product.category === selectedCategory
    const searchMatch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.origin.toLowerCase().includes(searchQuery.toLowerCase())

    return categoryMatch && searchMatch
  })

  return (
    <>
      <div className="py-16 sm:py-20 bg-white scroll-mt-20" id="gallery">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold mb-4">{t("gallery_title")}</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">{t("gallery_subtitle")}</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-6 sm:mb-8 px-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                aria-label="Search products"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Category Filters */}
          <div className="mb-8 sm:mb-12 px-4">
            <div className="flex flex-wrap justify-center gap-1 sm:gap-2 md:gap-4 max-w-4xl mx-auto">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 lg:px-6 py-1.5 sm:py-2 md:py-3 rounded-full transition-all duration-300 whitespace-nowrap text-xs sm:text-sm lg:text-base ${
                    selectedCategory === category.value
                      ? "bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  aria-label={`Filter by ${category.label}`}
                >
                  <span className="text-xs sm:text-sm md:text-base">{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-lg sm:text-xl text-gray-600 mb-4">No products found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 px-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(product.name)}`
                      }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <button
                        className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-3 sm:px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 transform scale-90 group-hover:scale-100 text-xs sm:text-sm"
                        aria-label={`View details for ${product.name}`}
                      >
                        <Eye size={14} />
                        View Details
                      </button>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 flex flex-col flex-grow">
                    <h3 className="text-lg sm:text-xl font-bold mb-2">{product.name}</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
                      {product.certifications.slice(0, 2).map((cert) => (
                        <span key={cert} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {cert}
                        </span>
                      ))}
                      {product.certifications.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{product.certifications.length - 2}
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-auto">
                      <p className="mb-1">
                        <span className="font-medium">Origins:</span> {product.origin}
                      </p>
                      <p>
                        <span className="font-medium">Season:</span> {product.season}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </>
  )
}

// Enhanced Testimonials Component
function Testimonials() {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [likedTestimonials, setLikedTestimonials] = useState<Set<number>>(new Set())
  const isMobile = useMediaQuery("(max-width: 640px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")

  const testimonials = [
    {
      name: "Sophie Dubois",
      company: "Carrefour",
      location: "Paris, France",
      rating: 5,
      text: "Carrefour has been consistently impressed with Euro Negoce's exceptional quality standards and reliability. Their Tunisian olive oil and Spanish citrus products have become customer favorites across our French stores. The team's professionalism and attention to detail in every shipment makes them our preferred Mediterranean produce partner.",
      role: "International Procurement Manager",
      highlight: "Exceptional Quality Standards",
    },
    {
      name: "David Thompson",
      company: "Tesco",
      location: "London, United Kingdom",
      rating: 5,
      text: "Euro Negoce has transformed our fresh produce sourcing with their outstanding Italian tomatoes and Spanish peppers. The consistency in quality, freshness, and extended shelf life has significantly improved our customer satisfaction. Their logistics coordination is seamless and their customer service is truly world-class.",
      role: "Fresh Produce Category Manager",
      highlight: "Outstanding Product Quality",
    },
    // Add more testimonials...
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const toggleLike = (index: number) => {
    const newLiked = new Set(likedTestimonials)
    if (newLiked.has(index)) {
      newLiked.delete(index)
    } else {
      newLiked.add(index)
    }
    setLikedTestimonials(newLiked)
  }

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(nextTestimonial, 5000)
    return () => clearInterval(interval)
  }, [isPlaying])

  const stats = [
    { number: "100+", label: t("stats_clients"), color: "from-blue-500 to-blue-600" },
    { number: "10+", label: t("stats_countries"), color: "from-green-500 to-green-600" },
    { number: "1000+", label: t("stats_tons"), color: "from-purple-500 to-purple-600" },
    { number: "99%", label: t("stats_delivery"), color: "from-orange-500 to-orange-600" },
  ]

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50" id="testimonials">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Client Success Stories
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Trusted by leading retailers and distributors worldwide for quality, reliability, and exceptional service
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-8 sm:mb-12 md:mb-16 px-4">
          {stats.map((stat, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100 transform hover:scale-105">
                <div
                  className={`text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1 sm:mb-2`}
                >
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 xl:p-12 border border-gray-100 overflow-hidden">
            {/* Controls */}
            <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
              <button
                onClick={prevTestimonial}
                className="p-2 sm:p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 group"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={isMobile ? 18 : 24} className="text-gray-700 group-hover:text-gray-900" />
              </button>

              <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-all duration-300"
                  aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                >
                  {isPlaying ? (
                    <Pause size={isMobile ? 12 : 16} className="text-blue-600" />
                  ) : (
                    <Play size={isMobile ? 12 : 16} className="text-blue-600" />
                  )}
                </button>

                <div className="flex space-x-1 sm:space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? "bg-gradient-to-r from-green-600 to-blue-600 scale-125"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={nextTestimonial}
                className="p-2 sm:p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 group"
                aria-label="Next testimonial"
              >
                <ChevronRight size={isMobile ? 18 : 24} className="text-gray-700 group-hover:text-gray-900" />
              </button>
            </div>

            {/* Testimonial Content */}
            <div className="md:flex items-start gap-4 sm:gap-6 md:gap-8">
              <div className="md:w-1/3 mb-4 sm:mb-6 md:mb-0 flex flex-col items-center">
                {/* Company Display */}
                <div className="relative mb-3 sm:mb-4">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 xl:w-40 xl:h-40 rounded-xl bg-gradient-to-br from-blue-50 to-green-50 shadow-xl border border-gray-200 p-3 sm:p-4 lg:p-6 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center">
                        <Building size={isMobile ? 16 : isTablet ? 20 : 24} className="text-white" />
                      </div>
                      <div className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 leading-tight">
                        {testimonials[currentIndex].company}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Info */}
                <div className="w-full text-center p-2 sm:p-3 lg:p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100">
                  <div className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Company</div>
                  <div className="text-sm sm:text-base lg:text-lg font-bold text-blue-600">
                    {testimonials[currentIndex].company}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">{testimonials[currentIndex].location}</div>
                </div>
              </div>

              <div className="lg:w-2/3">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} size={isMobile ? 14 : 18} className="text-yellow-400 fill-current" />
                  ))}
                  <button
                    onClick={() => toggleLike(currentIndex)}
                    className={`ml-auto p-2 rounded-full transition-all duration-300 ${
                      likedTestimonials.has(currentIndex)
                        ? "bg-red-100 text-red-500"
                        : "bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-400"
                    }`}
                    aria-label={likedTestimonials.has(currentIndex) ? "Unlike testimonial" : "Like testimonial"}
                  >
                    <Heart
                      size={isMobile ? 12 : 16}
                      className={likedTestimonials.has(currentIndex) ? "fill-current" : ""}
                    />
                  </button>
                </div>

                <blockquote className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-700 mb-4 sm:mb-6 leading-relaxed italic">
                  <Quote size={isMobile ? 16 : 20} className="inline-block mr-2 text-blue-500 opacity-60" />
                  {testimonials[currentIndex].text}
                </blockquote>

                <div className="border-t border-gray-100 pt-3 sm:pt-4 lg:pt-6">
                  <div className="font-bold text-base sm:text-lg lg:text-xl text-gray-800 mb-1">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-green-600 font-medium mb-1 text-sm sm:text-base">
                    {testimonials[currentIndex].role}
                  </div>
                  <div className="bg-blue-50 text-blue-800 inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    {testimonials[currentIndex].highlight}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Footer Component
function Footer() {
  const [showImprint, setShowImprint] = useState(false)
  const [showCookies, setShowCookies] = useState(false)
  const [showLegalNotice, setShowLegalNotice] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const { t } = useTranslation()
  const isMobile = useMediaQuery("(max-width: 640px)")

  return (
    <>
      <footer className="bg-slate-900 text-slate-400 py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-center md:text-left">© 2025 Euro Negoce. All rights reserved.</p>
            <div className="flex flex-wrap gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm items-center justify-center">
              <button
                className="hover:text-white transition-colors"
                onClick={() => setShowImprint(true)}
                aria-label="View imprint information"
              >
                Imprint
              </button>
              <button
                className="hover:text-white transition-colors"
                onClick={() => setShowCookies(true)}
                aria-label="View cookie policy"
              >
                Cookies
              </button>
              <button
                className="hover:text-white transition-colors"
                onClick={() => setShowLegalNotice(true)}
                aria-label="View legal notice"
              >
                Legal Notice
              </button>
              <button
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
                onClick={() => setShowContactModal(true)}
                aria-label="Contact us"
              >
                <Mail size={isMobile ? 12 : 16} />
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ImprintModal isOpen={showImprint} onClose={() => setShowImprint(false)} />
      <CookieConsent isManuallyOpened={showCookies} onClose={() => setShowCookies(false)} />
      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />

      {/* Legal Notice Modal */}
      {showLegalNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-4 sm:py-6 px-4 sm:px-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FileText size={isMobile ? 18 : 24} />
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold">Legal Notice</h2>
                  <p className="text-slate-200 mt-1 text-sm sm:text-base">Terms and conditions</p>
                </div>
              </div>
              <button
                onClick={() => setShowLegalNotice(false)}
                className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
                aria-label="Close legal notice"
              >
                <X size={isMobile ? 20 : 24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-8">
              <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Terms and Conditions</h3>
                <p className="text-sm sm:text-base text-gray-700">
                  These terms and conditions outline the rules and regulations for the use of Euro Negoce's Website.
                </p>
                <p className="text-sm sm:text-base text-gray-700">
                  By accessing this website, we assume you accept these terms and conditions. Do not continue to use the
                  Euro Negoce website if you do not agree to take all of the terms and conditions stated on this page.
                </p>
                <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mt-4 sm:mt-6 mb-3 sm:mb-4">License</h4>
                <p className="text-sm sm:text-base text-gray-700">
                  Unless otherwise stated, Euro Negoce and/or its licensors own the intellectual property rights for all
                  material on the Euro Negoce website. All intellectual property rights are reserved.
                </p>
                <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mt-4 sm:mt-6 mb-3 sm:mb-4">
                  Restrictions
                </h4>
                <p className="text-sm sm:text-base text-gray-700">You are specifically restricted from:</p>
                <ul className="list-disc pl-4 sm:pl-6 text-sm sm:text-base text-gray-700 space-y-1 sm:space-y-2 mt-2">
                  <li>Publishing any website material in any other media</li>
                  <li>Selling, sublicensing and/or otherwise commercializing any website material</li>
                  <li>Publicly performing and/or showing any website material</li>
                  <li>Using this website in any way that is or may be damaging to this website</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 px-4 sm:px-8 py-3 sm:py-4 bg-gray-50">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowLegalNotice(false)}
                  className="px-4 sm:px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Main Website Component
export default function EuroNegoceWebsite() {
  const [showContactModal, setShowContactModal] = useState(false)
  const [showProductsModal, setShowProductsModal] = useState(false)
  const [showScheduler, setShowScheduler] = useState(false)
  const { t } = useTranslation()

  // Add event listeners for chatbot integration
  useEffect(() => {
    const handleOpenQuoteModal = () => {
      setShowContactModal(true)
    }

    const handleOpenContactModal = () => {
      setShowContactModal(true)
    }

    const handleOpenCallScheduler = () => {
      setShowScheduler(true)
    }

    const handleOpenProductsModal = () => {
      setShowProductsModal(true)
    }

    // Add event listeners
    window.addEventListener("openQuoteModal", handleOpenQuoteModal)
    window.addEventListener("openContactModal", handleOpenContactModal)
    window.addEventListener("openCallScheduler", handleOpenCallScheduler)
    window.addEventListener("openProductsModal", handleOpenProductsModal)

    // Cleanup event listeners
    return () => {
      window.removeEventListener("openQuoteModal", handleOpenQuoteModal)
      window.removeEventListener("openContactModal", handleOpenContactModal)
      window.removeEventListener("openCallScheduler", handleOpenCallScheduler)
      window.removeEventListener("openProductsModal", handleOpenProductsModal)
    }
  }, [])

  return (
    <>
      <CookieConsent />
      <Header />
      <Hero
        showContactModal={showContactModal}
        setShowContactModal={setShowContactModal}
        showProductsModal={showProductsModal}
        setShowProductsModal={setShowProductsModal}
        showScheduler={showScheduler}
        setShowScheduler={setShowScheduler}
      />
      <GlobalOperationsSection t={t} />
      <ProductGallery />
      <Testimonials />
      <Footer />
      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
      <ProductsModal isOpen={showProductsModal} onClose={() => setShowProductsModal(false)} />
      <AppointmentScheduler isOpen={showScheduler} onClose={() => setShowScheduler(false)} />
      <ChatBot
        onOpenProducts={() => setShowProductsModal(true)}
        onOpenContact={() => setShowContactModal(true)}
        onOpenQuote={() => setShowContactModal(true)}
        onOpenAppointment={() => setShowScheduler(true)}
      />
    </>
  )
}
