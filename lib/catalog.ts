export const company = { name: 'Multi Equipment Trade and Services Pvt. Ltd.', address: 'Chakupat-10, Lalitpur, Nepal', phone: '01-5268736', call: '+97715268736', whatsapp: '9779841449957', email: 'metsnepal.services@gmail.com', gpoBox: '8975', epc: '5222' };
export const siteOrigin = 'https://multi-equipment-nepal.whole-hill-4202.chatgpt.site';
export const wa = (message = 'Hello Multi Equipment Trade and Services, I would like to make an inquiry.') => `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;
export const productWa = (name: string) => wa(`Hello Multi Equipment Trade and Services, I am interested in ${name}. Please provide price and availability.`);
export type Product = {
    id: string;
    sku: string | null;
    name: string;
    slug: string;
    brand: string;
    category: string;
    type: string;
    shortDescription: string;
    description: string;
    images: string[];
    price: number | null;
    salePrice: number | null;
    stock: number | null;
    availability: string;
    features: string[];
    specifications: {
        name: string;
        value: string;
    }[];
    applications: string;
    includedAccessories: string;
    warranty: string;
    manufacturer: string;
    documents: {
        name: string;
        url: string;
    }[];
    tags: string[];
    published: boolean;
    featured: boolean;
    createdAt: string;
    seoTitle: string;
    seoDescription: string;
};
export const categories = [
    { slug: 'oxygen-respiratory-care', name: 'Oxygen & Respiratory Care', description: 'Concentrators, portable oxygen and therapy accessories.', image: '/images/web-document-image1.jpeg', children: ['Oxygen Concentrators', 'Portable Oxygen Concentrators', 'Oxygen Accessories', 'Oxygen Therapy Products'] },
    { slug: 'sleep-therapy', name: 'Sleep Therapy', description: 'PAP equipment, masks and compatible accessories.', image: '/images/sbox.webp', children: ['CPAP', 'APAP', 'BiPAP', 'Sleep Therapy Accessories', 'Masks'] },
    { slug: 'hospital-equipment', name: 'Hospital Equipment', description: 'Equipment and accessories for everyday patient care.', image: '/images/web-document-image3.jpeg', children: ['Patient-care equipment', 'Monitoring equipment', 'Medical accessories'] },
    { slug: 'diagnostic-equipment', name: 'Diagnostic Equipment', description: 'Explore patient monitoring and diagnostic equipment.', image: '/images/web-document-image2.jpeg', children: ['Patient monitoring', 'Diagnostic devices', 'Related accessories'] },
    { slug: 'medical-consumables', name: 'Medical Consumables', description: 'Tubes, masks, filters and replacement accessories.', image: '/images/mask.webp', children: ['Tubes', 'Masks', 'Filters', 'Accessories', 'Replacement parts'] },
    { slug: 'service-spare-parts', name: 'Service & Spare Parts', description: 'Compatible parts and maintenance support.', image: '/images/visionaire.webp', children: ['Replacement parts', 'Compressor-related parts', 'Filters', 'Maintenance items'] }
];
const make = (id: string, name: string, slug: string, brand: string, category: string, type: string, image: string, desc: string): Product => ({ id, name, slug, brand, category, type, images: [image], shortDescription: desc, description: desc + ' Contact our team to confirm the exact model, suitability, compatible accessories, current price and availability before ordering.', sku: null, price: null, salePrice: null, stock: null, availability: 'Contact for availability', features: [], specifications: [], applications: 'Please consult the manufacturer’s instructions and your healthcare professional about suitability.', includedAccessories: 'Contact us to confirm the items included with your selected model.', warranty: 'Contact us for the applicable warranty terms.', manufacturer: brand, documents: [], tags: [type, category, brand], published: false, featured: true, createdAt: '2026-10-03', seoTitle: name + ' in Nepal', seoDescription: desc });
// Draft records must be verified by the company before publication.
export const referenceProducts = [make('visionaire', 'VisionAire Oxygen Concentrator', 'visionaire-oxygen-concentrator', 'AirSep / CAIRE', 'oxygen-respiratory-care', 'Oxygen Concentrators', '/images/visionaire.webp', 'Ask about the VisionAire oxygen concentrator and its current supply options.'), make('portable', 'Portable Oxygen Concentrator', 'portable-oxygen-concentrator', 'CAIRE', 'oxygen-respiratory-care', 'Portable Oxygen Concentrators', '/images/portable.webp', 'Discuss portable oxygen equipment options with our team.'), make('sbox', 'S.Box APAP', 'sbox-apap', 'SEFAM', 'sleep-therapy', 'APAP', '/images/sbox.webp', 'Contact us for S.Box APAP product information and availability.'), make('pap', 'BiPAP / PAP Products', 'bipap-pap-products', 'SEFAM', 'sleep-therapy', 'BiPAP', '/images/sbox.webp', 'Request details of PAP models. The S.Box photo is a reference image, not a confirmed BiPAP model.'), make('accessories', 'Oxygen Accessories', 'oxygen-accessories', 'Unspecified', 'medical-consumables', 'Accessories', '/images/oxygen-accessories.jpg', 'Ask about compatible oxygen therapy accessories for your equipment.')];
// Product information and photography supplied in AirSep website.docx.
export const airSepDocumentProducts: Product[] = [
    {
        ...make('visionaire', 'AirSep VisionAire 5 Oxygen Concentrator', 'visionaire-oxygen-concentrator', 'AirSep / CAIRE', 'oxygen-respiratory-care', 'Oxygen Concentrators', '/images/airsep-document-1.jpg', 'Compact stationary oxygen concentrator providing 1–5 LPM continuous-flow supplemental oxygen for home and healthcare settings.'),
        description: 'The AirSep VisionAire 5 is a compact, lightweight stationary oxygen concentrator designed for continuous-flow oxygen therapy from 1 to 5 liters per minute. Manufactured by AirSep / CAIRE Inc., it is designed for long-term oxygen therapy in home care, clinics, nursing and long-term-care facilities. Simple controls, an easy-to-read flow meter and a compact design support everyday use. Oxygen therapy should be used as prescribed by an appropriately qualified healthcare professional.',
        features: ['1–5 LPM continuous flow', 'Compact, lightweight design', 'Easy-to-read flow meter', 'System alarm functions', 'Low-maintenance design'],
        specifications: [{ name: 'Oxygen flow', value: '1–5 LPM, continuous flow' }, { name: 'Oxygen concentration', value: 'Approximately 95%, as stated in the supplied product document; confirm operating conditions in the manufacturer datasheet.' }, { name: 'Power consumption', value: '290 W' }, { name: 'Weight', value: '13.6 kg' }, { name: 'Noise level', value: 'Approximately 39 dB(A)' }, { name: 'Operation', value: 'Stationary' }],
        applications: 'Prescribed oxygen therapy in home care, clinics, nursing and long-term-care facilities. Confirm suitability with a qualified healthcare professional.',
        warranty: '1-year standard warranty stated in the supplied product document. Contact us to confirm coverage and applicable terms.',
        manufacturer: 'AirSep / CAIRE Inc.', tags: ['oxygen', 'AirSep', 'CAIRE', 'VisionAire', '5 LPM', 'continuous flow']
    },
    {
        ...make('newlife-intensity-10', 'AirSep NewLife Intensity 10 Oxygen Concentrator', 'newlife-intensity-10-oxygen-concentrator', 'AirSep / CAIRE', 'oxygen-respiratory-care', 'Oxygen Concentrators', '/images/airsep-document-2.jpg', 'Stationary oxygen concentrator delivering continuous-flow supplemental oxygen up to 10 LPM for prescribed higher-flow therapy.'),
        description: 'The NewLife Intensity 10 is a stationary oxygen concentrator designed to provide continuous-flow supplemental oxygen up to 10 liters per minute. Its high-flow capability, compressor system and durable construction support patients prescribed higher oxygen flow rates. The unit has built-in flow control and alarm functions for use in home oxygen therapy, clinics, nursing facilities and selected healthcare environments. Confirm the prescribed flow and suitability with a qualified healthcare professional.',
        features: ['Continuous-flow oxygen delivery up to 10 LPM', 'Built-in flow control', 'Durable compressor system', 'Built-in safety and alarm systems', 'Designed for home and healthcare environments'],
        specifications: [{ name: 'Maximum oxygen flow', value: '10 LPM' }, { name: 'Oxygen delivery', value: 'Continuous flow' }, { name: 'Oxygen concentration', value: 'Up to approximately 95%, depending on flow and operating conditions, as stated in the supplied document.' }, { name: 'Operation', value: 'Stationary' }, { name: 'Flow adjustment', value: 'Built-in flow control' }, { name: 'Safety', value: 'Built-in alarm and safety systems' }],
        applications: 'Prescribed higher-flow oxygen therapy in home care, clinics, nursing facilities and selected healthcare environments.',
        warranty: '1-year standard warranty stated in the supplied product document. Contact us to confirm coverage and applicable terms.',
        manufacturer: 'AirSep / CAIRE Inc.', tags: ['oxygen', 'AirSep', 'CAIRE', 'NewLife', 'Intensity', '10 LPM', 'continuous flow']
    },
    {
        ...make('portable', 'CAIRE Comfort Freestyle Portable Oxygen Concentrator', 'portable-oxygen-concentrator', 'CAIRE', 'oxygen-respiratory-care', 'Portable Oxygen Concentrators', '/images/airsep-document-3.jpg', 'Compact portable oxygen concentrator with pulse-dose delivery and a rechargeable battery for prescribed oxygen support on the move.'),
        description: 'The CAIRE Comfort Freestyle is a compact portable oxygen concentrator designed to provide supplemental oxygen while supporting mobility in daily life. Its portable form factor and rechargeable battery system offer flexibility outside the home for patients prescribed supplemental oxygen. The supplied product document describes pulse-dose / demand oxygen delivery and operation using battery or AC power. Confirm the exact model, prescribed settings and suitability with our team and your healthcare professional before purchase.',
        features: ['Portable, compact design', 'Pulse-dose / demand oxygen delivery', 'Rechargeable battery system', 'Battery and AC power operation', 'Easy-to-carry form factor', 'User-friendly operation'],
        specifications: [{ name: 'Product type', value: 'Portable oxygen concentrator' }, { name: 'Oxygen delivery', value: 'Pulse-dose / demand oxygen delivery' }, { name: 'Power', value: 'Battery and AC power' }, { name: 'Battery', value: 'Rechargeable' }, { name: 'Design', value: 'Compact and portable' }],
        applications: 'Prescribed supplemental oxygen in the home and during daily activities outside the home, where medically appropriate. Confirm model-specific travel requirements with the manufacturer and carrier.',
        warranty: '1-year standard warranty stated in the supplied product document. Contact us to confirm coverage and applicable terms.',
        manufacturer: 'CAIRE Inc., USA', tags: ['oxygen', 'CAIRE', 'Comfort', 'Freestyle', 'portable', 'pulse dose']
    }
];
for (const product of airSepDocumentProducts) {
    product.published = true;
    const existingIndex = referenceProducts.findIndex(p => p.id === product.id);
    if (existingIndex >= 0) referenceProducts[existingIndex] = product;
    else referenceProducts.splice(1, 0, product);
}
export const currency = (n: number) => new Intl.NumberFormat('en-NP', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(n);
export const priceOf = (p: Product) => p.salePrice ?? p.price;
export const services = ['Equipment inspection', 'Preventive maintenance', 'Troubleshooting & repair', 'Oxygen concentrator servicing', 'Replacement parts', 'Compressor-related service', 'Filter replacement', 'Technical support'];
export const legalPages = [['privacy-policy', 'Privacy Policy'], ['terms-and-conditions', 'Terms & Conditions'], ['shipping-policy', 'Shipping Policy'], ['return-refund-policy', 'Return / Refund Policy'], ['warranty-policy', 'Warranty Policy'], ['medical-product-disclaimer', 'Medical Product Disclaimer']];
export const legalDefaults: Record<string, string> = { 'privacy-policy': 'We collect the contact, delivery and equipment details you submit to respond to inquiries and process requests. Please avoid sharing patient records or sensitive medical information. Contact the company to request access, correction or deletion of your submitted information. This website is currently available for private review; final privacy terms and retention periods must be approved before public launch.', 'terms-and-conditions': 'Product listings are general information. Prices, availability, specifications, compatibility, payment and delivery terms are subject to confirmation by our team. Submitting a request does not guarantee stock or acceptance of an order. Final terms must be reviewed and published by the company before public launch.', 'shipping-policy': 'Delivery and office pickup can be requested. Our team will confirm serviceability, delivery charges and timing for your location before accepting your order. No delivery fee or timeframe is assumed.', 'return-refund-policy': 'Please contact the company before returning an item. Applicable return eligibility, refund terms and any restrictions for medical or opened consumable products must be confirmed with the company before purchase.', 'warranty-policy': 'Warranty coverage varies by product and manufacturer. Request the applicable written warranty, exclusions and service process before purchase. No warranty duration is assumed.', 'medical-product-disclaimer': 'Product information is provided for general information. Please follow the manufacturer’s instructions and consult an appropriately qualified healthcare professional where applicable. Our website does not provide diagnosis or medical advice.' };
