import type { Product } from './catalog';

export const product = (id: string, name: string, brand: string, category: string, type: string, image: string, shortDescription: string): Product => ({
    id, slug: id, name, brand, category, type, images: [image], shortDescription, description: shortDescription,
    sku: null, price: null, salePrice: null, stock: null, availability: 'Contact for availability',
    features: [], specifications: [], applications: '', includedAccessories: 'Contact us to confirm the accessories supplied with your order.',
    warranty: 'Contact us to confirm the applicable warranty coverage and terms.', manufacturer: '', documents: [],
    tags: [name, brand, type], published: true, featured: false, createdAt: '2026-10-06',
    seoTitle: `${name} in Nepal`, seoDescription: shortDescription
});

export const clinicalProducts: Product[] = [
    {
        ...product('sonicaid-one-fetal-doppler', 'Huntleigh Sonicaid One Fetal Doppler', 'Huntleigh', 'diagnostic-equipment', 'Fetal Dopplers', '/images/sonicaid-one.jpg', 'Compact handheld fetal Doppler with a numeric heart-rate display, probe and built-in speaker for clinical use.'),
        description: 'The Sonicaid One is a handheld fetal Doppler for use by appropriately trained healthcare professionals. Its compact design, numeric fetal heart-rate display and built-in speaker support fetal heart assessment during clinical examinations. The supplied photo shows the Sonicaid One model. Contact our team for the current model-specific datasheet, probe configuration, power requirements and availability.',
        features: ['Compact handheld design', 'Numeric fetal heart-rate display', 'Built-in speaker with volume controls', 'Connected handheld probe'],
        specifications: [{ name: 'Model', value: 'Sonicaid One' }, { name: 'Product type', value: 'Handheld fetal Doppler' }, { name: 'Display', value: 'Numeric heart-rate display' }, { name: 'Probe frequency and power requirements', value: 'Request the Sonicaid One manufacturer datasheet for the supplied configuration.' }],
        applications: 'Fetal heart assessment by appropriately trained healthcare professionals, following the manufacturer’s instructions. A Doppler reading does not replace a full clinical assessment.',
        manufacturer: 'Huntleigh Healthcare', tags: ['Sonicaid', 'Sonicaid One', 'Huntleigh', 'fetal', 'Doppler', 'obstetric', 'diagnostic']
    },
    {
        ...product('best-care-nebulizer-pro', 'Best Care Nebulizer Pro', 'Best Care', 'oxygen-respiratory-care', 'Nebulizers', '/images/best-care-nebulizer-pro.jpeg', 'Compressor nebulizer with simple button operation, a carry handle and adult and child mask options for prescribed inhalation therapy.'),
        description: 'Best Care Nebulizer Pro is a compressor nebulizer for administering compatible prescribed inhalation medication. Simple button operation and a carry handle support everyday handling, while adult and child mask options allow the appropriate interface to be selected. The supplied product information lists an 8 ml medication cup. Follow the medication instructions and manufacturer guidance for setup, use, cleaning and maintenance. Contact our team to confirm the exact kit contents and technical datasheet before ordering.',
        features: ['Simple button operation', 'Compressor-based nebulization', 'Carry handle for convenient handling', 'Adult and child mask options', 'Medication cup capacity listed as 8 ml in the supplied information'],
        specifications: [{ name: 'Model', value: 'Nebulizer Pro' }, { name: 'Product type', value: 'Compressor nebulizer' }, { name: 'Medication cup capacity', value: '8 ml, as stated in the supplied product information; confirm the supplied model.' }, { name: 'Particle size, nebulization rate and power', value: 'Contact us for the model-specific manufacturer datasheet.' }],
        applications: 'Prescribed inhalation therapy for adults and children, with the appropriate interface and healthcare guidance.',
        includedAccessories: 'Adult and child mask options, mouthpiece, tubing and nebulizer kit are described in the supplied information. Confirm included accessories, filter quantity and any carrying bag before ordering.',
        tags: ['Best Care', 'BestCare', 'nebulizer', 'Nebulizer Pro', 'compressor', 'respiratory', 'adult', 'child']
    }
];
