import Link from 'next/link';
import { PageIntro } from './storefront';
import { companyFromContent } from '@/lib/company';

const sections = [
  ['aboutWho', 'Who We Are', `We are a medical equipment supply and service company specializing in respiratory care, oxygen therapy, sleep therapy and other healthcare equipment.

Our experience in medical equipment allows us to support customers not only with product supply, but also with product guidance, installation, troubleshooting, maintenance and after-sales service.

We believe that supplying medical equipment is more than simply selling a product. It is about understanding the customer's requirements and helping them choose an appropriate solution for their healthcare needs.`],
  ['aboutWhat', 'What We Do', `Respiratory & Oxygen Therapy
We supply and support a range of oxygen and respiratory care equipment, including:
• Oxygen concentrators
• Portable oxygen concentrators
• High-flow oxygen concentrators
• Oxygen therapy accessories
• Respiratory care equipment
• Related medical consumables and accessories

We work with products from established international medical equipment manufacturers and brands.

Sleep Therapy Solutions
We provide sleep-therapy equipment and solutions, including:
• CPAP machines
• APAP machines
• BiPAP / Bi-level devices
• Sleep therapy accessories
• Masks, tubing and related supplies

Medical Equipment Supply
We support hospitals, clinics, healthcare facilities and individual customers with medical equipment sourcing and supply.

Technical Service & Repair
Our services include:
• Medical equipment inspection
• Preventive maintenance
• Troubleshooting
• Repair and servicing
• Equipment testing and performance checks
• Technical consultation
• Spare parts and accessories support

Our goal is to help customers keep their medical equipment operating reliably and safely.`],
  ['aboutMission', 'Our Mission', `To make reliable medical technology more accessible and provide professional support that customers can trust.

Our mission is to connect patients and healthcare providers with quality medical equipment while providing dependable technical and after-sales support.

We continuously work to improve our product knowledge, technical capabilities and customer service so that we can better support Nepal's healthcare community.`],
  ['aboutCommitment', 'Our Commitment', `Quality
We strive to provide genuine, reliable and quality medical equipment from established manufacturers and suppliers.

Professional Service
Our team focuses on providing knowledgeable product guidance, technical support and responsive after-sales service.

Customer Satisfaction
We believe long-term customer relationships are more important than a one-time sale. We listen to our customers and work to provide solutions that meet their requirements.

Technical Support
Medical equipment requires proper installation, operation and maintenance. We are committed to supporting customers beyond the point of purchase.

Trust & Transparency
We believe in honest communication, clear product information and responsible service.

Continuous Improvement
Healthcare technology continues to evolve. We continuously improve our product knowledge and technical capabilities to provide better solutions to our customers.`],
  ['aboutWhy', 'Why Customers Choose Us', `Quality Medical Equipment
We focus on providing dependable medical equipment from recognized manufacturers and brands.

Professional Technical Support
Our service doesn't end after delivery. We provide technical guidance, troubleshooting and maintenance support.

Respiratory Care Expertise
Our focus on oxygen therapy and respiratory care enables us to provide more specialized product guidance in these areas.

Home & Healthcare Solutions
Whether you are an individual looking for oxygen equipment or a healthcare facility requiring medical equipment, we provide solutions for different applications.

After-Sales Service
We believe reliable after-sales support is an important part of medical equipment ownership.

Customer-Centered Approach
We take time to understand customer requirements and recommend products based on their intended application, rather than simply selling equipment.`],
  ['aboutServing', 'Serving Healthcare in Nepal', `From home oxygen therapy to clinics, hospitals and healthcare institutions, Multi Equipment Trade & Services Pvt. Ltd. aims to be a dependable partner for medical equipment supply and technical service in Nepal.

We are based in Chakupat-10, Lalitpur, Nepal.`],
  ['aboutVision', 'Our Vision', `To become a trusted and respected medical equipment supply and service company in Nepal.

We envision a healthcare environment where patients, healthcare professionals and institutions can access reliable medical technology together with dependable technical support.`]
];

function TextSections({ text }: { text: string }) {
  return <>{text.split(/\n\s*\n/).map((block, index) => {
    const lines = block.split('\n');
    const bullets = lines.filter(line => line.startsWith('• '));
    const prose = lines.filter(line => !line.startsWith('• '));
    return <div key={index} className="about-text-block">{prose.length > 1 ? <><h3>{prose[0]}</h3><p>{prose.slice(1).join(' ')}</p></> : <p>{prose[0]}</p>}{bullets.length > 0 && <ul>{bullets.map(line => <li key={line}>{line.slice(2)}</li>)}</ul>}</div>;
  })}</>;
}

export default function AboutPage({ content }: { content: Record<string, string> }) {
  const contact = companyFromContent(content);
  return <><PageIntro eyebrow="MULTI EQUIPMENT TRADE & SERVICES PVT. LTD." title="About Us">Reliable Medical Equipment. Professional Service. Better Healthcare.</PageIntro>
    <div className="container content-section about-page">
      <section className="about-introduction"><h2>Multi Equipment Trade & Services Pvt. Ltd.</h2><TextSections text={content.aboutIntro || `Multi Equipment Trade & Services Pvt. Ltd. is a Nepal-based medical equipment supply, service and technical support company located in Chakupat-10, Lalitpur, Nepal.

We are committed to providing reliable medical equipment and professional after-sales service to hospitals, clinics, healthcare institutions, nursing facilities, healthcare professionals and individual customers.

With a focus on quality products, technical expertise and customer support, we aim to make dependable healthcare technology more accessible across Nepal.`}/></section>
      {sections.map(([key, title, fallback]) => <section className="about-section" key={key}><h2>{title}</h2><TextSections text={content[key] || fallback}/></section>)}
      <section className="panel about-contact"><h2>Contact Us</h2><p>Whether you need a medical equipment quotation, product information, technical assistance or after-sales support, our team is ready to help.</p><p>{contact.address}</p><div className="hero-buttons"><a className="btn" href={`tel:${contact.call}`}>Call {contact.phone}</a><a className="btn whatsapp" href={`https://wa.me/${contact.whatsapp}`}>WhatsApp: 984-1449957</a><Link className="btn outline" href="/request-quote">Request a Quote</Link></div></section>
      <div className="about-signoff"><h2>Your Trusted Partner in Medical Equipment & Service</h2><p>Multi Equipment Trade & Services Pvt. Ltd.</p><p>Medical Equipment Supply · Respiratory Care · Oxygen Therapy · Sleep Therapy · Technical Service</p></div>
    </div></>;
}
