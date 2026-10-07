import type { Product } from './catalog';
import { product as createProduct } from './clinical-products';

export const oxygenAccessoryProducts: Product[] = [
    {
        ...createProduct('oxygen-concentrator-hepa-filter', 'Oxygen Concentrator HEPA Filter', 'Unspecified', 'service-spare-parts', 'Filters', '/images/oxygen-concentrator-hepa-filter.png', 'Replacement HEPA filter options for oxygen concentrators. Contact us to match the correct filter to your equipment.'),
        description: 'Oxygen concentrator HEPA filter options for replacement and maintenance. The supplied photo shows several filter designs; it does not represent a confirmed multi-piece kit. Share your concentrator brand, model and existing filter part number or photo so our team can confirm the appropriate replacement. Installation and replacement intervals must follow the equipment manufacturer’s instructions.',
        features: ['Replacement filter options', 'Model-specific compatibility assistance'],
        specifications: [{ name: 'Product type', value: 'Oxygen concentrator HEPA filter' }, { name: 'Part number, dimensions and filtration rating', value: 'Contact us to confirm the selected filter.' }],
        applications: 'Maintenance of compatible oxygen concentrators, following the manufacturer’s service instructions.',
        includedAccessories: 'Confirm the selected filter design and quantity before ordering.',
        tags: ['oxygen', 'concentrator', 'HEPA', 'Hapa', 'filter', 'replacement', 'spare parts']
    },
    {
        ...createProduct('oxygen-concentrator-filter', 'Oxygen Concentrator Filter', 'Unspecified', 'service-spare-parts', 'Filters', '/images/oxygen-concentrator-filter.jpg', 'Replacement filter options for compatible oxygen concentrators. Ask our team about the correct type and fit.'),
        description: 'Replacement oxygen concentrator filter options for equipment maintenance. The supplied photo illustrates different filter types, rather than a confirmed kit. Send your equipment brand, model and filter details to confirm compatibility, part number and the quantity required. Follow the manufacturer’s instructions for cleaning or replacement; filter maintenance requirements vary by model.',
        features: ['Different replacement filter options', 'Compatibility confirmation before ordering'],
        specifications: [{ name: 'Product type', value: 'Oxygen concentrator replacement filter' }, { name: 'Filter type and part number', value: 'Confirm against the equipment model.' }],
        applications: 'Maintenance of compatible oxygen concentrators.',
        includedAccessories: 'Confirm the filter type and quantity included in your order.',
        tags: ['oxygen', 'concentrator', 'filter', 'foam', 'replacement', 'maintenance']
    },
    {
        ...createProduct('salter-labs-humidifier-bottle', 'Salter Labs Humidifier Bottle', 'Salter Labs', 'oxygen-respiratory-care', 'Oxygen Accessories', '/images/salter-labs-humidifier-bottle.jpg', 'Oxygen humidifier bottle from Salter Labs. Confirm the model, connections and equipment compatibility with our team.'),
        description: 'Salter Labs humidifier bottle for use with compatible oxygen therapy equipment when specified by the equipment instructions and healthcare guidance. Contact our team to confirm the supplied model, bottle capacity, connector type and intended flow range. Follow the manufacturer’s instructions for filling, cleaning and replacement.',
        features: ['Bottle with connection ports', 'Model and connection compatibility support'],
        specifications: [{ name: 'Brand', value: 'Salter Labs' }, { name: 'Product type', value: 'Oxygen humidifier bottle' }, { name: 'Capacity, connector and flow range', value: 'Contact us for the selected model’s datasheet.' }],
        applications: 'Use with compatible prescribed oxygen therapy equipment, where indicated.',
        includedAccessories: 'Confirm the bottle model and any connection accessories supplied.',
        manufacturer: 'Salter Labs', tags: ['Salter', 'Salter Labs', 'humidifier', 'bottle', 'oxygen', 'accessories']
    },
    {
        ...createProduct('salter-labs-cannula', 'Salter Labs Cannula', 'Salter Labs', 'medical-consumables', 'Oxygen Accessories', '/images/salter-labs-cannula.jpg', 'Nasal cannula for compatible prescribed oxygen therapy. Contact us to confirm size, tubing length and model.'),
        description: 'Salter Labs nasal cannula for use with compatible prescribed oxygen delivery equipment. The supplied photo shows nasal prongs and clear tubing. Confirm the model, patient size, tubing length and supported flow range with our team before ordering. Use, replacement and disposal must follow the manufacturer’s instructions and healthcare guidance.',
        features: ['Nasal prongs with oxygen tubing', 'Size and equipment compatibility confirmation'],
        specifications: [{ name: 'Brand', value: 'Salter Labs' }, { name: 'Product type', value: 'Nasal oxygen cannula' }, { name: 'Size, tubing length and flow range', value: 'Contact us to confirm the supplied model.' }],
        applications: 'Prescribed oxygen delivery using compatible equipment and the appropriate cannula size.',
        includedAccessories: 'Confirm model, tubing length, package contents and quantity before ordering.',
        manufacturer: 'Salter Labs', tags: ['Salter', 'Salter Labs', 'cannula', 'nasal', 'oxygen', 'tubing', 'consumables']
    }
];

export const sleepAccessoryProducts: Product[] = [
    {
        ...createProduct('cpap-bipap-mask', 'CPAP / BiPAP Mask', 'SEFAM', 'sleep-therapy', 'Masks', '/images/cpap-bipap-mask.jpg', 'Full-face mask option for compatible CPAP and BiPAP equipment. Contact us to confirm model, size and fit.'),
        description: 'Full-face mask for use with compatible prescribed PAP therapy equipment. The supplied image identifies the Breeze Facial Comfort Full Face design and shows an adjustable forehead frame and swivel hose connector. Contact us to confirm the exact mask model, size, headgear and compatibility with your CPAP or BiPAP device before ordering. Follow the manufacturer’s fitting and cleaning instructions.',
        features: ['Full-face mask design', 'Adjustable forehead frame shown in the supplied image', 'Swivel hose connector shown in the supplied image'],
        specifications: [{ name: 'Product type', value: 'Full-face PAP therapy mask' }, { name: 'Size and device compatibility', value: 'Contact us to confirm the selected model.' }],
        applications: 'Prescribed PAP therapy using a suitable mask fit and compatible equipment.',
        includedAccessories: 'Confirm mask size, headgear and package contents before ordering.',
        tags: ['accessories', 'CPAP', 'BiPAP', 'PAP', 'mask', 'SEFAM', 'Breeze', 'full face']
    },
    {
        ...createProduct('heated-tube', 'SEFAM Heated Tube', 'SEFAM', 'sleep-therapy', 'Sleep Therapy Accessories', '/images/heated-tube.jpg', 'Heated breathing tube for compatible PAP therapy equipment. Confirm the connector and device model before ordering.'),
        description: 'Heated breathing tube accessory for compatible PAP therapy equipment. The supplied photo shows a corrugated hose with an electrical connector. Compatibility depends on the device, hose connection and heating system. Share your equipment brand and model so our team can confirm a suitable tube, its dimensions and manufacturer instructions.',
        features: ['Corrugated breathing tube', 'Electrical connector for compatible heating systems'],
        specifications: [{ name: 'Product type', value: 'Heated breathing tube' }, { name: 'Length, diameter, connector and compatibility', value: 'Contact us to confirm the supplied model.' }],
        applications: 'Use with compatible prescribed PAP therapy equipment, following the manufacturer’s instructions.',
        includedAccessories: 'Confirm the supplied tube and any adapters before ordering.',
        manufacturer: 'SEFAM', tags: ['accessories', 'SEFAM', 'heated', 'tube', 'hose', 'pipe', 'CPAP', 'BiPAP', 'PAP']
    }
];
for (const accessory of oxygenAccessoryProducts) accessory.tags.push('accessories');
