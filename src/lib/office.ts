// Accra office location used by the map in the homepage contact section.
//
// The map is Google's own embed of the official "The Psyche Consult" Google Maps listing
// (Plus Code JP4R+VGW, Lapaz), so it shows the same red pin and office card as Google Maps.
//
// To change the location later: open the listing in Google Maps -> Share -> Embed a map ->
// Copy HTML, then replace the pb=... part of OFFICE_EMBED_URL below.
export const OFFICE_NAME = 'The Psyche Consult Ghana Ltd (Accra Office)';
export const OFFICE_ADDRESS_LINES = ['Flower St., Tabora No. 3', 'Adjacent Orthodox Church', 'Lapaz, Accra, Ghana'];

// Exact point of the pin (used for directions).
export const OFFICE_COORDS = '5.6072375,-0.2586719';

// Google embed of the listing. The camera values (!1d zoom distance, !2d/!3d centre) are set
// so the pin sits in the middle of the map and is zoomed in close to Flower St.
export const OFFICE_EMBED_URL =
  'https://www.google.com/maps/embed?pb=' +
  '!1m18!1m12!1m3!1d1000!2d-0.2586719!3d5.6072375' +
  '!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2' +
  '!1s0xfdf991575e49603%3A0x6f9df5f69439bfcd!2sThe%20Psyche%20Consult' +
  '!5e0!3m2!1sen!2sgh!4v1792833753416!5m2!1sen!2sgh';

// Opens the actual Google Maps listing (reviews, photos, phone) for the office.
export const OFFICE_MAPS_URL = 'https://www.google.com/maps?cid=8042854948951146445';

// Turn-by-turn directions to the exact pin.
export const OFFICE_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(OFFICE_COORDS)}`;
