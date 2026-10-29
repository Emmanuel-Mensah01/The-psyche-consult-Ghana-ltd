// Accra office location used by the map on the homepage contact section.
//
// For a pin-perfect location: stand at the office in Google Maps, tap and hold to drop a pin,
// then copy the two numbers shown (e.g. 5.6xxxx, -0.2xxxx) into OFFICE_COORDS below.
// While OFFICE_COORDS is empty, the map finds the office from the address text.
export const OFFICE_NAME = 'The Psyche Consult Ghana Ltd (Accra Office)';
export const OFFICE_ADDRESS_LINES = ['Flower St., Tabora No. 3', 'Adjacent Orthodox Church', 'Lapaz, Accra, Ghana'];
export const OFFICE_COORDS = ''; // e.g. '5.6123,-0.2456'

const addressQuery = 'Flower St, Tabora No. 3, adjacent Orthodox Church, Lapaz, Accra, Ghana';
const query = OFFICE_COORDS || addressQuery;

export const OFFICE_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=17&hl=en&output=embed`;
export const OFFICE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
export const OFFICE_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
