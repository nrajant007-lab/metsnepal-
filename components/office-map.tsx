const defaultLocation = 'M8J9+MXV, Patan Dhoka Road, Lalitpur, Bagmati Province 44600, Nepal';
const defaultQuery = 'M8J9+MXV, Lalitpur, Nepal';

export function OfficeLocation({ location = defaultLocation, query = defaultQuery }: { location?: string; query?: string }) {
    return <><p>{location}</p><a className="text-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`} target="_blank" rel="noopener noreferrer">View office on Google Maps</a></>;
}

export default function OfficeMap({ name, location = defaultLocation, query = defaultQuery }: { name: string; location?: string; query?: string }) {
    return <section className="panel" aria-labelledby="office-map-title" style={{ marginTop: 32 }}><h2 id="office-map-title" style={{ fontSize: 26 }}>Find our office</h2><h3>{name}</h3><OfficeLocation location={location} query={query}/><iframe title={`Google Maps location of ${name}`} src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=18&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen style={{ width: '100%', height: 360, border: 0, borderRadius: 10, marginTop: 20 }}/></section>;
}
