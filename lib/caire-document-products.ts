import type { Product } from './catalog';

// Descriptions and photographs supplied by the company in its product document.
function product(id: string, name: string, slug: string, brand: string, category: string, type: string, image: number, summary: string, description: string, features: string[], specifications: Product['specifications'], applications: string, manufacturer = brand): Product {
    return { id, name, slug, brand, category, type, images: [`/images/caire-list-image${image}.${image === 6 ? 'png' : 'jpeg'}`], shortDescription: summary, description, features, specifications, applications, manufacturer,
        sku: null, price: null, salePrice: null, stock: null, availability: 'Contact for availability',
        includedAccessories: 'Contact us to confirm included accessories for the exact model. Items shown in the photograph may be optional.',
        warranty: 'Contact us for the applicable warranty terms.', documents: [], tags: [name, brand, type, category], published: true, featured: false, createdAt: '2026-10-05', seoTitle: `${name} in Nepal`, seoDescription: summary };
}

export const caireDocumentProducts: Product[] = [
    product('eclipse-5', 'CAIRE SeQual Eclipse 5 Portable Oxygen Concentrator', 'caire-sequal-eclipse-5-portable-oxygen-concentrator', 'CAIRE', 'oxygen-respiratory-care', 'Portable Oxygen Concentrators', 1,
        'Portable oxygen concentrator offering continuous-flow and pulse-dose delivery, with AC, DC and rechargeable battery power options.',
        'The CAIRE SeQual Eclipse 5 is a portable oxygen concentrator for prescribed supplemental oxygen at home and while travelling. Continuous-flow and pulse-dose oxygen delivery options provide flexibility for different prescribed requirements. Its rechargeable battery supports mobility, while an easy-to-use control panel, oxygen monitoring and safety alarms support everyday operation. Confirm suitability, prescribed settings and model-specific travel requirements before purchase.',
        ['Continuous-flow and pulse-dose oxygen delivery', 'Rechargeable battery system', 'AC and DC power operation', 'Easy-to-use control panel', 'Integrated oxygen monitoring and safety alarms', 'Portable design for home and mobile use'],
        [{ name: 'Model', value: 'SeQual Eclipse 5' }, { name: 'Oxygen delivery', value: 'Continuous flow and pulse dose' }, { name: 'Power options', value: 'AC, DC and rechargeable battery' }],
        'Prescribed oxygen therapy at home, in clinics and during mobile activities, where medically appropriate.', 'CAIRE Inc., USA'),
    product('pap', 'SEFAM S.Box Duo ST BiPAP Machine', 'sefam-sbox-duo-st-bipap', 'SEFAM', 'sleep-therapy', 'BiPAP', 2,
        'Bi-level non-invasive ventilation device with Spontaneous/Timed (ST) mode for prescribed respiratory support.',
        'The SEFAM S.Box Duo ST is a BiPAP / non-invasive ventilation device designed for patients requiring assisted breathing during sleep or under medical supervision. It provides two-level positive airway pressure to support inhalation and exhalation according to prescribed therapy. Spontaneous/Timed (ST) mode can provide timed respiratory support when required. Adjustable inspiratory and expiratory pressure, user-friendly controls and a compact design support use in home and clinical environments according to the patient’s prescription.',
        ['Bi-level positive airway pressure', 'Spontaneous/Timed (ST) ventilation mode', 'Adjustable inspiratory and expiratory pressure', 'User-friendly interface and controls', 'Compact design', 'Monitoring and safety features'],
        [{ name: 'Model', value: 'S.Box Duo ST' }, { name: 'Device type', value: 'BiPAP / non-invasive ventilation device' }, { name: 'Therapy', value: 'Two-level positive airway pressure' }, { name: 'Mode', value: 'Spontaneous/Timed (ST)' }],
        'Prescribed respiratory and ventilatory support in home and clinical settings.', 'SEFAM, France'),
    product('sbox', 'SEFAM S.Box APAP', 'sbox-apap', 'SEFAM', 'sleep-therapy', 'APAP', 3,
        'Auto-adjusting positive airway pressure device for prescribed sleep therapy, with intuitive controls and therapy monitoring capabilities.',
        'The SEFAM S.Box APAP is an Auto-Adjusting Positive Airway Pressure device for prescribed sleep therapy. It adjusts pressure within the prescribed range according to breathing patterns to support the airway during sleep. Its compact design, display and user-friendly controls are intended to make nightly PAP therapy convenient. The supplied document describes therapy monitoring and data management capabilities. Use only according to the prescribed therapy and manufacturer’s instructions.',
        ['Automatic pressure adjustment within the prescribed range', 'User-friendly display and controls', 'Compact design', 'Therapy monitoring and data management capabilities', 'Designed for long-term prescribed PAP therapy'],
        [{ name: 'Model', value: 'S.Box APAP' }, { name: 'Device type', value: 'Auto-adjusting positive airway pressure device' }, { name: 'Therapy', value: 'Automatic PAP therapy' }],
        'Prescribed therapy for obstructive sleep apnea in home and travel settings.', 'SEFAM, France'),
    product('choicemmed-pulse-oximeter', 'ChoiceMMed Pulse Oximeter', 'choicemmed-pulse-oximeter', 'ChoiceMMed', 'diagnostic-equipment', 'Patient monitoring', 4,
        'Compact fingertip monitor for blood oxygen saturation (SpO₂) and pulse rate, with a digital display and one-button operation.',
        'The ChoiceMMed Pulse Oximeter is a compact, lightweight fingertip monitoring device designed to measure blood oxygen saturation (SpO₂) and pulse rate. A digital display, one-button operation and battery power support convenient portable use in homes, clinics, hospitals and medical practices. Confirm the exact model and intended use with our team. Measurements should be interpreted in the context of professional healthcare guidance.',
        ['Measures blood oxygen saturation (SpO₂)', 'Measures pulse rate', 'Compact fingertip design', 'Digital display', 'Simple one-button operation', 'Battery powered'],
        [{ name: 'Device type', value: 'Fingertip pulse oximeter' }, { name: 'Measurements', value: 'SpO₂ and pulse rate' }, { name: 'Operation', value: 'One-button operation' }, { name: 'Power', value: 'Battery powered' }],
        'Oxygen saturation and pulse rate monitoring in home and healthcare settings. Confirm model-specific intended use.'),
    product('gemmy-tc-750a', 'GEMMY Autoclave TC-750A', 'gemmy-autoclave-tc-750a', 'GEMMY', 'hospital-equipment', 'Sterilization equipment', 5,
        'Pressurized steam sterilizer for compatible heat- and moisture-resistant medical, dental and laboratory instruments.',
        'The GEMMY TC-750A is a steam autoclave designed for sterilization of compatible medical, dental, laboratory and healthcare instruments. It uses high-temperature saturated steam under pressure for instruments that tolerate heat and moisture. The supplied document describes a stainless-steel chamber, operating controls and safety features. Confirm instrument compatibility and follow the manufacturer’s validated sterilization procedures and facility infection-control protocols.',
        ['High-temperature pressurized steam sterilization', 'Stainless-steel chamber', 'Operating controls', 'Safety features for controlled operation', 'Designed for medical, dental and laboratory applications'],
        [{ name: 'Model', value: 'TC-750A' }, { name: 'Device type', value: 'Steam autoclave / sterilizer' }, { name: 'Sterilization method', value: 'High-temperature pressurized steam' }, { name: 'Chamber', value: 'Stainless steel, as stated in the supplied document' }],
        'Sterilization of compatible instruments in clinics, hospitals, laboratories and dental practices.', 'GEMMY, Taiwan'),
    product('gemmy-laboratory-incubator', 'GEMMY Laboratory Incubator', 'gemmy-laboratory-incubator', 'GEMMY', 'hospital-equipment', 'Laboratory equipment', 6,
        'Temperature-controlled laboratory incubator for procedures requiring consistent incubation conditions.',
        'The GEMMY Laboratory Incubator provides a controlled temperature environment for laboratory incubation. It is intended for medical laboratories, research facilities, educational institutions and hospitals. The supplied document describes adjustable temperature control, a temperature display, an insulated chamber and an easy-to-clean interior. Contact our team for the exact model, temperature range, chamber capacity and application compatibility.',
        ['Adjustable temperature control', 'Temperature display', 'Insulated chamber', 'Easy-to-clean interior', 'Practical laboratory design'],
        [{ name: 'Device type', value: 'Laboratory incubator' }, { name: 'Temperature control', value: 'Adjustable; request model-specific range and accuracy' }, { name: 'Operation', value: 'Temperature-controlled incubation' }],
        'Medical, clinical, microbiology and research laboratory procedures requiring controlled incubation conditions.', 'GEMMY, Taiwan'),
    product('genoray-c-arm', 'GENORAY C-Arm Machine', 'genoray-c-arm-machine', 'GENORAY', 'diagnostic-equipment', 'Diagnostic imaging', 7,
        'Mobile C-arm X-ray fluoroscopy system for real-time imaging during surgical and interventional procedures.',
        'The GENORAY C-Arm is a mobile fluoroscopy X-ray imaging system for real-time imaging during surgical and interventional procedures. Its mobile C-arm configuration allows trained healthcare professionals to position the system around a patient. The supplied document describes digital image display and processing, flexible positioning and a user-friendly interface. Contact our team for the exact model, configuration, site requirements and manufacturer specifications. Operation requires appropriately qualified personnel and applicable radiation-safety procedures.',
        ['Mobile C-arm fluoroscopy system', 'Real-time imaging', 'Flexible C-arm positioning', 'Digital image display and processing', 'User-friendly operating interface'],
        [{ name: 'System type', value: 'Mobile C-arm X-ray / fluoroscopy system' }, { name: 'Imaging', value: 'Real-time digital fluoroscopy' }, { name: 'Model', value: 'Contact us to confirm the exact model and configuration' }],
        'Surgical and interventional imaging in hospitals, operating rooms, orthopedic and specialty centers.', 'GENORAY, Korea')
];
