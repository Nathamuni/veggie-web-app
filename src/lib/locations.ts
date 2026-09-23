/**
 * Real Indian cities and neighbourhoods for the manual location picker.
 * This is public geography, not demo data. Coordinates are approximate city
 * centres, used only to suggest the nearest city when a user opts in to
 * precise location; they are never stored.
 *
 * Chennai is the assumed pilot city (PRODUCT.md), so it has the fullest list.
 */

export type City = {
  name: string;
  state: string;
  lat: number;
  lng: number;
  areas: string[];
};

export const cities: City[] = [
  {
    name: "Chennai",
    state: "Tamil Nadu",
    lat: 13.0827,
    lng: 80.2707,
    areas: [
      "Adyar", "Alwarpet", "Ambattur", "Anna Nagar", "Ashok Nagar", "Besant Nagar", "Chromepet",
      "Egmore", "Guindy", "K.K. Nagar", "Kilpauk", "Kodambakkam", "Kotturpuram", "Madipakkam",
      "Mandaveli", "Medavakkam", "Mogappair", "Mylapore", "Nanganallur", "Nungambakkam",
      "Pallavaram", "Perambur", "Perungudi", "Porur", "Purasawalkam", "Royapettah", "Saidapet",
      "Sholinganallur", "T. Nagar", "Tambaram", "Teynampet", "Thiruvanmiyur", "Thoraipakkam",
      "Triplicane", "Vadapalani", "Valasaravakkam", "Velachery", "Villivakkam", "Virugambakkam",
      "West Mambalam",
    ],
  },
  {
    name: "Coimbatore",
    state: "Tamil Nadu",
    lat: 11.0168,
    lng: 76.9558,
    areas: [
      "Gandhipuram", "Peelamedu", "R.S. Puram", "Race Course", "Ramanathapuram", "Saibaba Colony",
      "Saravanampatti", "Singanallur", "Ukkadam", "Vadavalli",
    ],
  },
  {
    name: "Madurai",
    state: "Tamil Nadu",
    lat: 9.9252,
    lng: 78.1198,
    areas: ["Anna Nagar", "Goripalayam", "K.K. Nagar", "Periyar", "Simmakkal", "Tallakulam", "Thirunagar", "Villapuram"],
  },
  {
    name: "Tiruchirappalli",
    state: "Tamil Nadu",
    lat: 10.7905,
    lng: 78.7047,
    areas: ["Cantonment", "K.K. Nagar", "Srirangam", "Thillai Nagar", "Thiruverumbur", "Woraiyur"],
  },
  {
    name: "Puducherry",
    state: "Puducherry",
    lat: 11.9416,
    lng: 79.8083,
    areas: ["Lawspet", "Muthialpet", "Reddiarpalayam", "White Town"],
  },
  {
    name: "Bengaluru",
    state: "Karnataka",
    lat: 12.9716,
    lng: 77.5946,
    areas: [
      "Banashankari", "Basavanagudi", "Bellandur", "BTM Layout", "Electronic City", "Frazer Town",
      "Hebbal", "HSR Layout", "Indiranagar", "Jayanagar", "JP Nagar", "Koramangala", "Malleshwaram",
      "Marathahalli", "MG Road", "Rajajinagar", "Sarjapur Road", "Vijayanagar", "Whitefield",
      "Yelahanka",
    ],
  },
  {
    name: "Mysuru",
    state: "Karnataka",
    lat: 12.2958,
    lng: 76.6394,
    areas: ["Devaraja Mohalla", "Gokulam", "Jayalakshmipuram", "Kuvempunagar", "Saraswathipuram", "Vijayanagar"],
  },
  {
    name: "Hyderabad",
    state: "Telangana",
    lat: 17.385,
    lng: 78.4867,
    areas: [
      "Abids", "Ameerpet", "Banjara Hills", "Begumpet", "Dilsukhnagar", "Gachibowli", "HITEC City",
      "Himayatnagar", "Jubilee Hills", "Kondapur", "Kukatpally", "LB Nagar", "Madhapur",
      "Manikonda", "Miyapur", "Secunderabad", "Somajiguda", "Tarnaka",
    ],
  },
  {
    name: "Visakhapatnam",
    state: "Andhra Pradesh",
    lat: 17.6868,
    lng: 83.2185,
    areas: ["Dwaraka Nagar", "Gajuwaka", "Madhurawada", "MVP Colony", "Seethammadhara", "Siripuram"],
  },
  {
    name: "Vijayawada",
    state: "Andhra Pradesh",
    lat: 16.5062,
    lng: 80.648,
    areas: ["Benz Circle", "Governorpet", "Gunadala", "Labbipet", "Patamata"],
  },
  {
    name: "Kochi",
    state: "Kerala",
    lat: 9.9312,
    lng: 76.2673,
    areas: [
      "Aluva", "Edappally", "Ernakulam South", "Fort Kochi", "Kadavanthra", "Kakkanad", "Kaloor",
      "Palarivattom", "Panampilly Nagar", "Vyttila",
    ],
  },
  {
    name: "Thiruvananthapuram",
    state: "Kerala",
    lat: 8.5241,
    lng: 76.9366,
    areas: ["Kazhakkoottam", "Kowdiar", "Pattom", "Peroorkada", "Sasthamangalam", "Thampanoor", "Vazhuthacaud"],
  },
  {
    name: "Kozhikode",
    state: "Kerala",
    lat: 11.2588,
    lng: 75.7804,
    areas: ["Chevayur", "Mavoor Road", "Nadakkavu", "Palayam", "West Hill"],
  },
  {
    name: "Mumbai",
    state: "Maharashtra",
    lat: 19.076,
    lng: 72.8777,
    areas: [
      "Andheri", "Bandra", "Borivali", "Chembur", "Colaba", "Dadar", "Ghatkopar", "Goregaon", "Juhu",
      "Kandivali", "Lower Parel", "Malad", "Matunga", "Mulund", "Powai", "Santacruz", "Vile Parle",
      "Worli",
    ],
  },
  {
    name: "Pune",
    state: "Maharashtra",
    lat: 18.5204,
    lng: 73.8567,
    areas: [
      "Aundh", "Baner", "Deccan Gymkhana", "Hadapsar", "Hinjewadi", "Kalyani Nagar", "Koregaon Park",
      "Kothrud", "Shivajinagar", "Viman Nagar", "Wakad",
    ],
  },
  {
    name: "Ahmedabad",
    state: "Gujarat",
    lat: 23.0225,
    lng: 72.5714,
    areas: ["Bodakdev", "Ellisbridge", "Maninagar", "Navrangpura", "Paldi", "Prahlad Nagar", "Satellite", "Thaltej", "Vastrapur"],
  },
  {
    name: "Delhi",
    state: "Delhi",
    lat: 28.6139,
    lng: 77.209,
    areas: [
      "Chandni Chowk", "Connaught Place", "Dwarka", "Greater Kailash", "Hauz Khas", "Janakpuri",
      "Karol Bagh", "Lajpat Nagar", "Mayur Vihar", "Pitampura", "Rajouri Garden", "Rohini", "Saket",
      "Vasant Kunj",
    ],
  },
  {
    name: "Kolkata",
    state: "West Bengal",
    lat: 22.5726,
    lng: 88.3639,
    areas: [
      "Ballygunge", "Behala", "Dum Dum", "Esplanade", "Gariahat", "Lake Town", "New Town",
      "Park Street", "Salt Lake", "Tollygunge",
    ],
  },
];

export const states = Array.from(new Set(cities.map((c) => c.state)));

export function findCity(name: string): City | undefined {
  return cities.find((c) => c.name === name);
}

/** Nearest covered city to a point, with distance in km (haversine). */
export function nearestCity(lat: number, lng: number): { city: City; km: number } {
  const toRad = (d: number) => (d * Math.PI) / 180;
  let best = { city: cities[0], km: Infinity };
  for (const city of cities) {
    const dLat = toRad(city.lat - lat);
    const dLng = toRad(city.lng - lng);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat)) * Math.cos(toRad(city.lat)) * Math.sin(dLng / 2) ** 2;
    const km = 6371 * 2 * Math.asin(Math.sqrt(a));
    if (km < best.km) best = { city, km };
  }
  return best;
}

/** Beyond this, we say the user is outside the cities we cover rather than guessing. */
export const NEAREST_CITY_MAX_KM = 60;
