// Fictional sellers, people, organisations, reviews and copy for the RELIVE demo.

export const sellers = [
  { id: 's1', name: 'Meher’s Rail', handle: '@mehersrail', city: 'Pune', rating: 4.8, sales: 212, joined: '2023', tone: '#7E8F72', bio: 'Streetwear and denim, washed and steamed before every shipment.' },
  { id: 's2', name: 'Second Shirt Club', handle: '@secondshirt', city: 'Bengaluru', rating: 4.6, sales: 148, joined: '2024', tone: '#B85C3C', bio: 'Shirts, overshirts and anything with a good collar.' },
  { id: 's3', name: 'Rhea’s Wardrobe', handle: '@rheaswardrobe', city: 'Jaipur', rating: 4.7, sales: 96, joined: '2024', tone: '#6E6B3B', bio: 'Dresses and occasionwear I loved but outgrew.' },
  { id: 's4', name: 'Sole Cycle', handle: '@solecycle', city: 'Mumbai', rating: 4.9, sales: 305, joined: '2022', tone: '#4F5E47', bio: 'Pre-loved sneakers, deep-cleaned and deodorised.' },
  { id: 's5', name: 'Thread & Return', handle: '@threadreturn', city: 'Kochi', rating: 4.9, sales: 174, joined: '2023', tone: '#A7764B', bio: 'Handmade and upcycled bags and accessories.' },
  { id: 's6', name: 'Archive Avenue', handle: '@archiveavenue', city: 'Delhi', rating: 4.8, sales: 131, joined: '2023', tone: '#22211F', bio: 'Curated vintage outerwear and leather goods.' },
];

export const sellerById = (id) => sellers.find((s) => s.id === id);

export const categories = [
  { slug: 'women', name: 'Women', blurb: 'Dresses, denim and knits with a past worth continuing.', tone: '#E9C3B2', art: 'dress', filter: (p) => p.tags.includes('women') },
  { slug: 'men', name: 'Men', blurb: 'Overshirts, outerwear and trousers that have already been broken in.', tone: '#C9D2BE', art: 'coat', filter: (p) => p.tags.includes('men') },
  { slug: 'streetwear', name: 'Streetwear', blurb: 'Heavy hoodies, cargos and caps for the second lap.', tone: '#DCD2C1', art: 'hoodie', filter: (p) => p.tags.includes('streetwear') },
  { slug: 'vintage', name: 'Vintage', blurb: 'Pieces older than their next owners. Character included.', tone: '#D9C6A5', art: 'jacket', filter: (p) => p.tags.includes('vintage') },
  { slug: 'shoes', name: 'Shoes', blurb: 'Cleaned, deodorised and ready to walk somewhere new.', tone: '#CFD3D6', art: 'sneaker', filter: (p) => p.tags.includes('shoes') },
  { slug: 'bags', name: 'Bags', blurb: 'Totes, duffels and handmade carriers with plenty of miles left.', tone: '#E3D3BC', art: 'tote', filter: (p) => p.tags.includes('bags') },
  { slug: 'accessories', name: 'Accessories', blurb: 'The small things that change an outfit.', tone: '#E6D29A', art: 'sunglasses', filter: (p) => p.tags.includes('accessories') },
  { slug: 'new-with-tags', name: 'New with Tags', blurb: 'Bought, never worn. Still deserves to be.', tone: '#C9D2BE', art: 'bomber', filter: (p) => p.condition === 'New with tags' },
  { slug: 'under-499', name: 'Under ₹499', blurb: 'Small prices, full wardrobes.', tone: '#E9C3B2', art: 'cap', filter: (p) => p.price <= 499 },
];

export const categoryBySlug = (slug) => categories.find((c) => c.slug === slug);

export const trendingSearches = ['vintage denim', 'linen shirt', 'chelsea boots', 'crochet bag', 'cargo', 'slip dress', 'hoodie'];

export const testimonials = [
  { name: 'Ishita R.', role: 'Demo persona, buyer', quote: 'The jacket arrived smelling like nothing at all, which is exactly what you want from second-hand.' },
  { name: 'Kabir M.', role: 'Demo persona, seller', quote: 'Listing took four minutes. My old sneakers found someone who actually wears them.' },
  { name: 'Anaya S.', role: 'Demo persona, donor', quote: 'I cleared two bags from my cupboard and knew where they were going. That mattered to me.' },
];

export const productReviews = [
  { name: 'Demo reviewer A.', rating: 5, text: 'Exactly as described. Packed with care.' },
  { name: 'Demo reviewer K.', rating: 4, text: 'Lovely condition, fit runs slightly large.' },
  { name: 'Demo reviewer P.', rating: 5, text: 'Seller answered my questions within the hour.' },
];

export const partners = [
  { name: 'Warm Threads Collective', focus: 'Winterwear for night shelters', tone: '#C9D2BE' },
  { name: 'Second Stitch Trust', focus: 'Repairs donated clothing for school uniforms', tone: '#E9C3B2' },
  { name: 'Loop Textile Lab', focus: 'Recycles unwearable fabric into insulation', tone: '#DCD2C1' },
];

export const demoStats = [
  { value: '12,400', label: 'garments re-homed' },
  { value: '3,100', label: 'kg of textiles kept in use' },
  { value: '860', label: 'donation pickups' },
];

export const seasonalEdits = [
  { title: 'Monsoon layers', copy: 'Quick-dry shirts and jackets that shrug off a drizzle.', ids: ['rl-024', 'rl-026', 'rl-016'], tone: '#C9D2BE' },
  { title: 'Wedding guest, second time round', copy: 'Occasionwear worn once and ready for its next celebration.', ids: ['rl-022', 'rl-003', 'rl-027'], tone: '#E9C3B2' },
  { title: 'The cold-weather archive', copy: 'Wool, suede and fleece for the few cold weeks that count.', ids: ['rl-009', 'rl-015', 'rl-029'], tone: '#DCD2C1' },
];

export const team = [
  { name: 'Tara Venkat', role: 'Founder, product', note: 'Fictional demo profile', tone: '#7E8F72' },
  { name: 'Arjun Dsouza', role: 'Head of sourcing', note: 'Fictional demo profile', tone: '#B85C3C' },
  { name: 'Nisha Rao', role: 'Repair studio lead', note: 'Fictional demo profile', tone: '#6E6B3B' },
  { name: 'Dev Malhotra', role: 'Community & donations', note: 'Fictional demo profile', tone: '#4F5E47' },
];

export const reuseGuides = {
  care: [
    { title: 'Wash less, wash cold', body: 'Most garments need airing more than washing. Turn clothes inside out, use a cool cycle and skip the dryer when you can.' },
    { title: 'Store with space', body: 'Fold knits instead of hanging them, use wide hangers for coats, and keep cedar blocks in drawers for moths.' },
    { title: 'Treat stains early', body: 'Blot, never rub. Cold water first for protein stains like sweat or food; warm water only once you know what it is.' },
  ],
  repair: [
    { title: 'Sew back a button', body: 'Use doubled thread, leave a little slack under the button and wrap the shank six times before knotting.' },
    { title: 'Visible mending', body: 'Darn small holes with a contrasting thread. A sashiko-style patch turns a worn knee into a feature.' },
    { title: 'Re-heel and resole', body: 'Leather shoes and boots can usually be resoled two or three times. A cobbler costs less than new pairs.' },
  ],
  diy: [
    { title: 'Shirt to tote', time: '45 min', steps: ['Cut off sleeves and collar.', 'Turn inside out and sew the hem shut.', 'Use the sleeves as reinforced straps.'] },
    { title: 'Jeans to shorts', time: '20 min', steps: ['Mark length 2 cm longer than you want.', 'Cut straight across.', 'Wash once for a natural fray.'] },
    { title: 'Old tee to rag rug', time: '3 hrs', steps: ['Cut tees into 3 cm strips.', 'Braid three strips at a time.', 'Coil and stitch the braid into a flat circle.'] },
  ],
  recycle: [
    'Fabric that cannot be worn again can still be shredded into fibres for insulation, stuffing or industrial wipes.',
    'Remove buttons, zips and trims before recycling; mixed materials are harder to process.',
    'Natural fibres like cotton and wool are generally easier to recycle than blends.',
    'Check with local textile collection points about what they accept; requirements differ by city.',
  ],
};

export const helpFaqs = [
  { section: 'How to buy', items: [
    ['How do I buy an item?', 'Choose a size on the product page, add it to your cart and go through the four-step demo checkout. No real payment is taken.'],
    ['Can I save items for later?', 'Yes. Tap the heart to add to your wishlist, or use Save for later inside the cart. Both are stored in your browser.'],
  ]},
  { section: 'How to sell', items: [
    ['How do I list clothes?', 'Go to Sell, then Start selling. Add photos, details and a pickup preference, preview and publish. Listings are saved in your browser only.'],
    ['How should I price an item?', 'A good starting point is 30–50% of the original retail price, depending on condition and brand demand.'],
  ]},
  { section: 'Product conditions', items: [
    ['What do the condition labels mean?', 'New with tags: unworn. Like New: worn briefly, no visible wear. Gently Used: light wear noted by the seller. Vintage: 20+ years old.'],
  ]},
  { section: 'Returns and cancellations', items: [
    ['Can I cancel an order?', 'Demo orders can be cancelled from My Orders while they are in Placed or Confirmed status.'],
    ['Are returns supported?', 'This is a demo. The returns policy page shows example text only; no returns are processed.'],
  ]},
  { section: 'Payments in this demo', items: [
    ['Do you take real payments?', 'No. RELIVE is a frontend demo. Cash on Delivery and online payment options are simulated and no card details are collected.'],
    ['Which promo codes work?', 'Try RELIVE10 (10% off), THRIFT200 (₹200 off orders over ₹1,499) or FREESHIP (free standard shipping).'],
  ]},
  { section: 'Donations', items: [
    ['Is a real pickup scheduled?', 'No. The donation form saves a demo record in your browser so you can see how the flow works.'],
    ['What can I donate?', 'Clean, wearable clothing, shoes in pairs and bags. Undergarments, damaged or wet items are not accepted.'],
  ]},
  { section: 'Account and privacy', items: [
    ['Where is my data stored?', 'Only in your browser’s localStorage. Passwords are never stored. Logging out clears the demo session.'],
  ]},
  { section: 'Shipping information', items: [
    ['How long does delivery take?', 'Delivery windows shown at checkout are illustrative only: standard 4–6 days, express 1–2 days.'],
  ]},
  { section: 'Sustainability', items: [
    ['Are the impact numbers real?', 'No. All impact figures on RELIVE are illustrative demo estimates and are labelled that way.'],
  ]},
];

export const PROMO_CODES = {
  RELIVE10: { type: 'percent', value: 10, label: '10% off your order' },
  THRIFT200: { type: 'flat', value: 200, min: 1499, label: '₹200 off orders over ₹1,499' },
  FREESHIP: { type: 'shipping', value: 0, label: 'Free standard shipping' },
};

export const SHIPPING_METHODS = [
  { id: 'standard', name: 'Standard', eta: '4–6 days', price: 79, freeOver: 999 },
  { id: 'express', name: 'Express', eta: '1–2 days', price: 149 },
  { id: 'pickup', name: 'Eco pickup point', eta: '3–5 days', price: 0 },
];

export const FREE_SHIPPING_THRESHOLD = 999;

export const seedOrders = [
  { id: 'RLV-48213', createdAt: '2026-08-14T10:20:00.000Z', status: 'Delivered', items: [{ id: 'rl-005', size: 'M', qty: 1, price: 1290 }, { id: 'rl-008', size: 'One Size', qty: 1, price: 390 }], totals: { subtotal: 1680, discount: 0, shipping: 0, total: 1680 }, address: { name: 'Alka Jat', line: 'Demo address, Flat 4B', city: 'Demo City', state: 'Maharashtra', postal: '400001' }, payment: 'Cash on Delivery (demo)', shipping: 'standard', seed: true },
  { id: 'RLV-51907', createdAt: '2026-10-09T15:45:00.000Z', status: 'Shipped', items: [{ id: 'rl-003', size: 'S', qty: 1, price: 1190 }], totals: { subtotal: 1190, discount: 119, shipping: 0, total: 1071 }, address: { name: 'Alka Jat', line: 'Demo address, Flat 4B', city: 'Demo City', state: 'Maharashtra', postal: '400001' }, payment: 'Demo online payment', shipping: 'standard', seed: true },
];

export const seedDonations = [
  { id: 'DON-2207', createdAt: '2026-07-02T09:00:00.000Z', categories: ['Shirts & tops', 'Kids’ wear'], items: 14, condition: 'Good', method: 'Pickup', status: 'Distributed', seed: true },
  { id: 'DON-2391', createdAt: '2026-09-21T09:00:00.000Z', categories: ['Winterwear'], items: 6, condition: 'Like new', method: 'Drop-off', status: 'Received', seed: true },
];

export const DONATION_CATEGORIES = ['Shirts & tops', 'Trousers & jeans', 'Dresses & skirts', 'Winterwear', 'Kids’ wear', 'Shoes', 'Bags', 'Ethnic wear'];
