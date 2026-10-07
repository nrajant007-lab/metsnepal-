import { env } from 'cloudflare:workers';
import { categories, referenceProducts, airSepDocumentProducts, Product, legalDefaults } from './catalog';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { caireDocumentProducts } from './caire-document-products';
import { clinicalProducts } from './clinical-products';
import { oxygenAccessoryProducts, sleepAccessoryProducts } from './oxygen-accessories';
export function bundledCatalogOnly() { return process.env.VERCEL === '1' && !(env as unknown as {DB?: D1Database}).DB; }
function bundledProducts() {
    const records = new Map<string, Product>();
    for (const product of [...referenceProducts, ...airSepDocumentProducts, ...caireDocumentProducts, ...clinicalProducts, ...oxygenAccessoryProducts, ...sleepAccessoryProducts]) records.set(product.id, product);
    return [...records.values()].filter(p => p.published);
}
export async function previewCatalog() { return (env as unknown as Record<string, string>).CATALOG_PREVIEW === 'true' && !!await getChatGPTUser(); }
export function database() { const db = (env as unknown as {
    DB?: D1Database;
}).DB; if (!db)
    throw new Error('Database unavailable'); return db; }
export async function seed() {
    const db = database();
    await db.prepare('CREATE TABLE IF NOT EXISTS email_notifications (record_id TEXT PRIMARY KEY,kind TEXT NOT NULL,payload TEXT NOT NULL,origin TEXT NOT NULL,status TEXT NOT NULL,updated_at TEXT NOT NULL)').run();
    if (!await db.prepare('SELECT key FROM content WHERE key=?').bind('_sefam_postal_update_v1').first()) {
        const updates = [
            db.prepare('INSERT INTO content (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').bind('gpoBox', '8975'),
            db.prepare('INSERT INTO content (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').bind('epc', '5222')
        ];
        const source = sleepAccessoryProducts.find(p => p.id === 'heated-tube')!;
        const row = await db.prepare('SELECT data FROM products WHERE id=?').bind(source.id).first<{ data: string }>();
        const updated: Product = { ...(row ? JSON.parse(row.data) : source), name: source.name, brand: source.brand, manufacturer: source.manufacturer, seoTitle: source.seoTitle };
        updated.tags = [...new Set([...updated.tags, 'SEFAM'])];
        updates.push(db.prepare('INSERT INTO products (id,slug,data,published) VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data').bind(updated.id, updated.slug, JSON.stringify(updated), updated.published ? 1 : 0));
        updates.push(db.prepare('INSERT INTO content (key,value) VALUES (?,?)').bind('_sefam_postal_update_v1', 'Company-supplied SEFAM brand and postal details'));
        await db.batch(updates);
    }
    if (!await db.prepare('SELECT key FROM content WHERE key=?').bind('_accessories_list_v1').first()) {
        const additions = [];
        for (const product of [...oxygenAccessoryProducts, ...sleepAccessoryProducts]) {
            const row = await db.prepare('SELECT data FROM products WHERE id=?').bind(product.id).first<{ data: string }>();
            const updated: Product = row ? JSON.parse(row.data) : product;
            updated.tags = [...new Set([...updated.tags, 'accessories'])];
            additions.push(db.prepare('INSERT INTO products (id,slug,data,published) VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data').bind(updated.id, updated.slug, JSON.stringify(updated), updated.published ? 1 : 0));
        }
        additions.push(db.prepare('INSERT INTO content (key,value) VALUES (?,?)').bind('_accessories_list_v1', 'Six company-supplied accessories'));
        await db.batch(additions);
    }
    if (!await db.prepare('SELECT key FROM content WHERE key=?').bind('_oxygen_accessory_products_v1').first()) {
        const additions = oxygenAccessoryProducts.map(p => db.prepare('INSERT OR IGNORE INTO products (id,slug,data,published) VALUES (?,?,?,1)').bind(p.id, p.slug, JSON.stringify(p)));
        additions.push(db.prepare('INSERT OR IGNORE INTO brands (id,slug,data) VALUES (?,?,?)').bind('salter-labs', 'salter-labs', JSON.stringify({ name: 'Salter Labs', description: 'Explore oxygen therapy accessories and contact us for model details, compatibility and availability.', logo: '', published: true })));
        additions.push(db.prepare('INSERT INTO content (key,value) VALUES (?,?)').bind('_oxygen_accessory_products_v1', 'Company-supplied oxygen accessory photos and names'));
        await db.batch(additions);
    }
    if (!await db.prepare('SELECT key FROM content WHERE key=?').bind('_clinical_products_v1').first()) {
        const additions = clinicalProducts.map(p => db.prepare('INSERT OR IGNORE INTO products (id,slug,data,published) VALUES (?,?,?,1)').bind(p.id, p.slug, JSON.stringify(p)));
        for (const name of ['Huntleigh', 'Best Care']) {
            const slug = name.toLowerCase().replaceAll(' ', '-');
            additions.push(db.prepare('INSERT OR IGNORE INTO brands (id,slug,data) VALUES (?,?,?)').bind(slug, slug, JSON.stringify({ name, description: `Browse ${name} products and contact us for current price and availability.`, logo: '', published: true })));
        }
        additions.push(db.prepare('INSERT INTO content (key,value) VALUES (?,?)').bind('_clinical_products_v1', 'Sonicaid One and Best Care Nebulizer Pro supplied by the company'));
        await db.batch(additions);
    }
    if (!await db.prepare('SELECT key FROM content WHERE key=?').bind('_airsep_hero_image_v1').first()) {
        await db.batch([
            db.prepare('INSERT INTO content (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').bind('heroImage', '/images/hero-airsep-room.png'),
            db.prepare('INSERT INTO content (key,value) VALUES (?,?)').bind('_airsep_hero_image_v1', 'Concentrator from web (1).docx in the existing healthcare room')
        ]);
    }
    if (!await db.prepare('SELECT key FROM content WHERE key=?').bind('_web_document_category_images_v2').first()) {
        const imageUpdates = [];
        for (const category of categories.filter(c => ['oxygen-respiratory-care', 'hospital-equipment', 'diagnostic-equipment'].includes(c.slug))) {
            const existing = await db.prepare('SELECT data FROM categories WHERE slug=?').bind(category.slug).first<{ data: string }>();
            const updated = { ...(existing ? JSON.parse(existing.data) : category), image: category.image };
            imageUpdates.push(db.prepare('INSERT INTO categories (id,slug,data) VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data').bind(category.slug, category.slug, JSON.stringify(updated)));
        }
        imageUpdates.push(db.prepare('INSERT INTO content (key,value) VALUES (?,?)').bind('_web_document_category_images_v2', 'web.docx'));
        await db.batch(imageUpdates);
    }
    if (!await db.prepare('SELECT key FROM content WHERE key=?').bind('_caire_product_document_v1').first()) {
        const statements = [];
        for (const product of caireDocumentProducts) {
            const row = await db.prepare('SELECT data FROM products WHERE id=?').bind(product.id).first<{ data: string }>();
            const current = row ? JSON.parse(row.data) as Product : null;
            const updated = { ...product, ...(current ? { sku: current.sku, price: current.price, salePrice: current.salePrice, stock: current.stock, availability: current.availability, featured: current.featured } : {}) };
            statements.push(db.prepare('INSERT INTO products (id,slug,data,published) VALUES (?,?,?,1) ON CONFLICT(id) DO UPDATE SET slug=excluded.slug,data=excluded.data,published=1').bind(updated.id, updated.slug, JSON.stringify(updated)));
        }
        for (const name of [...new Set(caireDocumentProducts.map(p => p.brand))]) {
            const slug = name.toLowerCase();
            const row = await db.prepare('SELECT data FROM brands WHERE id=?').bind(slug).first<{ data: string }>();
            const brand = { name, description: `Browse ${name} equipment and contact our team for product information, price and availability.`, logo: '', ...(row ? JSON.parse(row.data) : {}), published: true };
            statements.push(db.prepare('INSERT INTO brands (id,slug,data) VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data').bind(slug, slug, JSON.stringify(brand)));
        }
        statements.push(db.prepare('INSERT INTO content (key,value) VALUES (?,?)').bind('_caire_product_document_v1', 'CAIRE SeQual Eclipse 5 Portable Oxygen Concentrator web site.docx'));
        await db.batch(statements);
    }
    // Apply this document import once, so future administrator edits are preserved.
    if (!await db.prepare('SELECT key FROM content WHERE key=?').bind('_airsep_document_v2').first()) {
        const imported = [];
        for (const product of airSepDocumentProducts) {
            const existing = await db.prepare('SELECT data,published FROM products WHERE id=?').bind(product.id).first<{ data: string; published: number }>();
            const current = existing ? JSON.parse(existing.data) as Product : null;
            const updated = { ...product, ...(current ? { price: current.price, salePrice: current.salePrice, stock: current.stock, sku: current.sku, availability: current.availability } : {}) };
            imported.push(db.prepare('INSERT INTO products (id,slug,data,published) VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET slug=excluded.slug,data=excluded.data,published=excluded.published').bind(updated.id, updated.slug, JSON.stringify(updated), updated.published ? 1 : 0));
        }
        imported.push(db.prepare('INSERT INTO content (key,value) VALUES (?,?)').bind('_airsep_document_v2', 'AirSep website.docx'));
        await db.batch(imported);
    }
    if (await db.prepare('SELECT key FROM content WHERE key=?').bind('_catalog_seeded').first())
        return;
    const statements = referenceProducts.map(p => db.prepare('INSERT OR IGNORE INTO products (id,slug,data,published) VALUES (?,?,?,0)').bind(p.id, p.slug, JSON.stringify(p)));
    for (const c of categories)
        statements.push(db.prepare('INSERT OR IGNORE INTO categories (id,slug,data) VALUES (?,?,?)').bind(c.slug, c.slug, JSON.stringify(c)));
    for (const name of ['AirSep', 'CAIRE', 'SEFAM'])
        statements.push(db.prepare('INSERT OR IGNORE INTO brands (id,slug,data) VALUES (?,?,?)').bind(name.toLowerCase(), name.toLowerCase(), JSON.stringify({ name, description: 'Contact our team about product options.', logo: '', published: false })));
    for (const [key, value] of Object.entries(legalDefaults))
        statements.push(db.prepare('INSERT OR IGNORE INTO content (key,value) VALUES (?,?)').bind(key, value));
    statements.push(db.prepare('INSERT OR IGNORE INTO content (key,value) VALUES (?,?)').bind('_catalog_seeded', 'true'));
    await db.batch(statements);
}
export async function getProducts(all = false): Promise<Product[]> { if (bundledCatalogOnly()) return bundledProducts(); await seed(); const preview = await previewCatalog(); const rows = await database().prepare(all || preview ? 'SELECT data,published FROM products' : 'SELECT data,published FROM products WHERE published = 1').all<{
    data: string;
    published: number;
}>(); return rows.results.map(r => ({ ...JSON.parse(r.data), published: !!r.published })); }
export async function getContent(): Promise<Record<string, string>> { if (bundledCatalogOnly()) return {...legalDefaults, heroImage: '/images/hero-airsep-room.png'}; await seed(); const rows = await database().prepare('SELECT key,value FROM content').all<{
    key: string;
    value: string;
}>(); return Object.fromEntries(rows.results.map(r => [r.key, r.value])); }
export async function getCategories() { if (bundledCatalogOnly()) return categories.map(c => ({...c, id:c.slug})); await seed(); const rows = await database().prepare('SELECT id,slug,data FROM categories').all<{
    id:string;
    slug:string;
    data: string;
}>(); return rows.results.map(r => ({...JSON.parse(r.data),id:r.id,slug:r.slug})); }
export async function getBrands() { if (bundledCatalogOnly()) return [...new Set(bundledProducts().map(p => p.brand))].map(name => ({id:name.toLowerCase().replaceAll(' ', '-'), slug:name.toLowerCase().replaceAll(' ', '-'), name, description:'', logo:'', published:true})); await seed(); const rows = await database().prepare('SELECT id,slug,data FROM brands').all<{
    id: string;
    slug: string;
    data: string;
}>(); return rows.results.map(r => ({ id: r.id, slug: r.slug, ...JSON.parse(r.data) })); }
