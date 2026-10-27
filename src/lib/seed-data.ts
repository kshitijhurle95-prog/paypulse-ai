import { Transaction } from '@/types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'INV2-9842-1001',
    date: '2026-10-25',
    customerName: 'Sarah Miller',
    customerEmail: 'sarah.miller@example.com',
    description: '3 Boxes of Artisan Vanilla & Berry Cupcakes (12pk each)',
    type: 'INVOICE',
    amount: 75.00,
    currency: 'USD',
    status: 'OVERDUE',
    dueDate: '2026-10-15',
    isOverdue: true,
    paypalUrl: 'https://www.sandbox.paypal.com/invoice/p/#INV2-9842-1001',
    items: [
      { name: 'Artisan Cupcake 12-Pack', quantity: 3, unitPrice: 25.00 }
    ],
    notes: 'Party order for Autumn fest - Net 10 terms'
  },
  {
    id: 'INV2-9842-1002',
    date: '2026-10-24',
    customerName: 'David Kim',
    customerEmail: 'david.kim@techstart.io',
    description: 'Executive Breakfast Pastry Platter (Croissants, Danishes, Brioche)',
    type: 'INVOICE',
    amount: 110.00,
    currency: 'USD',
    status: 'OVERDUE',
    dueDate: '2026-10-14',
    isOverdue: true,
    paypalUrl: 'https://www.sandbox.paypal.com/invoice/p/#INV2-9842-1002',
    items: [
      { name: 'Corporate Pastry Platter', quantity: 2, unitPrice: 55.00 }
    ],
    notes: 'Board meeting catering'
  },
  {
    id: 'INV2-9842-1003',
    date: '2026-10-23',
    customerName: 'Elena Vance',
    customerEmail: 'elena.vance@studioart.com',
    description: 'Custom Hand-Painted Macaron Tower (60 pcs)',
    type: 'INVOICE',
    amount: 95.00,
    currency: 'USD',
    status: 'OVERDUE',
    dueDate: '2026-10-12',
    isOverdue: true,
    paypalUrl: 'https://www.sandbox.paypal.com/invoice/p/#INV2-9842-1003',
    items: [
      { name: 'Tiered Macaron Display', quantity: 1, unitPrice: 95.00 }
    ],
    notes: 'Art gallery opening reception'
  },
  {
    id: 'TX-88219-001',
    date: '2026-10-22',
    customerName: 'Sam Wilson',
    customerEmail: 'sam.wilson@falconair.com',
    description: 'SweetCrumb Handcrafted Ceramic Coffee Mug & Cinnamon Roll Bundle',
    type: 'DIRECT_PAYMENT',
    amount: 35.00,
    currency: 'USD',
    status: 'PAID',
    paypalUrl: 'https://www.sandbox.paypal.com/activity/payment/TX-88219-001',
    items: [
      { name: 'SweetCrumb Artisan Ceramic Mug', quantity: 1, unitPrice: 15.00 },
      { name: 'Jumbo Brioche Cinnamon Roll (4pk)', quantity: 1, unitPrice: 20.00 }
    ],
    notes: 'Customer reported mug handle arrived chipped during shipping'
  },
  {
    id: 'TX-88219-002',
    date: '2026-10-22',
    customerName: 'Marcus Thorne',
    customerEmail: 'marcus.t@apexlogistics.com',
    description: 'Artisan Sourdough Loaf 4-Week Bread Subscription (Weekly Delivery)',
    type: 'DIRECT_PAYMENT',
    amount: 55.00,
    currency: 'USD',
    status: 'REFUNDED',
    paypalUrl: 'https://www.sandbox.paypal.com/activity/payment/TX-88219-002',
    notes: 'Refunded due to courier delivery delay on Tuesday morning'
  },
  {
    id: 'TX-88219-003',
    date: '2026-10-21',
    customerName: 'Chloe Bennett',
    customerEmail: 'chloe.b@creativeagency.org',
    description: '3-Tier Floral Buttercream Wedding Cake Tasting Box',
    type: 'DIRECT_PAYMENT',
    amount: 65.00,
    currency: 'USD',
    status: 'REFUNDED',
    paypalUrl: 'https://www.sandbox.paypal.com/activity/payment/TX-88219-003',
    notes: 'Order rescheduled; customer requested full refund on Tuesday'
  },
  {
    id: 'TX-88219-004',
    date: '2026-10-21',
    customerName: 'Oliver Queen',
    customerEmail: 'oliver.queen@arrowcap.com',
    description: 'Gluten-Free Raspberry Cheesecake (9 inch)',
    type: 'DIRECT_PAYMENT',
    amount: 45.00,
    currency: 'USD',
    status: 'REFUNDED',
    paypalUrl: 'https://www.sandbox.paypal.com/activity/payment/TX-88219-004',
    notes: 'Damaged crust in transit; replaced and refunded'
  },
  {
    id: 'TX-88219-005',
    date: '2026-10-21',
    customerName: 'Jessica Jones',
    customerEmail: 'jessica@aliasinvestigations.net',
    description: 'Dark Roast Cold Brew Jug & Double Espresso Brownie Box',
    type: 'DIRECT_PAYMENT',
    amount: 20.00,
    currency: 'USD',
    status: 'REFUNDED',
    paypalUrl: 'https://www.sandbox.paypal.com/activity/payment/TX-88219-005',
    notes: 'Spilled during delivery driver handoff'
  },
  {
    id: 'INV2-9842-1004',
    date: '2026-10-26',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.sharma@innovate.co',
    description: 'Custom Red Velvet 2-Tier Birthday Cake with Gold Leaf Accents',
    type: 'INVOICE',
    amount: 145.00,
    currency: 'USD',
    status: 'PAID',
    paypalUrl: 'https://www.sandbox.paypal.com/invoice/p/#INV2-9842-1004',
    items: [
      { name: '2-Tier Custom Decorated Cake', quantity: 1, unitPrice: 145.00 }
    ],
    notes: 'Paid via PayPal Sandbox Wallet'
  },
  {
    id: 'INV2-9842-1005',
    date: '2026-10-25',
    customerName: 'Rahul Mehta',
    customerEmail: 'rahul.mehta@fintechlab.com',
    description: 'Weekly Fresh Croissant & Danish Box (Office Subscription)',
    type: 'INVOICE',
    amount: 40.00,
    currency: 'USD',
    status: 'SENT',
    dueDate: '2026-11-05',
    paypalUrl: 'https://www.sandbox.paypal.com/invoice/p/#INV2-9842-1005',
    items: [
      { name: 'Office Pastry Assortment', quantity: 1, unitPrice: 40.00 }
    ],
    notes: 'Invoice sent today'
  },
  {
    id: 'INV2-9842-1006',
    date: '2026-10-25',
    customerName: 'Aman Gupta',
    customerEmail: 'aman.gupta@soundwaves.io',
    description: 'Artisan Sourdough Loaves & Herb Focaccia Party Pack',
    type: 'INVOICE',
    amount: 40.00,
    currency: 'USD',
    status: 'SENT',
    dueDate: '2026-11-05',
    paypalUrl: 'https://www.sandbox.paypal.com/invoice/p/#INV2-9842-1006',
    items: [
      { name: 'Rustic Bread Basket', quantity: 1, unitPrice: 40.00 }
    ],
    notes: 'Invoice sent today'
  },
  {
    id: 'TX-88219-006',
    date: '2026-10-25',
    customerName: 'Lucas Grey',
    customerEmail: 'lucas.grey@vortexmedia.com',
    description: 'Matcha White Chocolate Swiss Roll & Genmaicha Tea Kit',
    type: 'DIRECT_PAYMENT',
    amount: 32.50,
    currency: 'USD',
    status: 'PAID',
    paypalUrl: 'https://www.sandbox.paypal.com/activity/payment/TX-88219-006'
  },
  {
    id: 'TX-88219-007',
    date: '2026-10-24',
    customerName: 'Sophia Turner',
    customerEmail: 'sophia.t@botanicalgardens.org',
    description: 'Botanical Herb Scone Box with Clotted Cream & Jam',
    type: 'DIRECT_PAYMENT',
    amount: 28.00,
    currency: 'USD',
    status: 'PAID',
    paypalUrl: 'https://www.sandbox.paypal.com/activity/payment/TX-88219-007'
  },
  {
    id: 'TX-88219-008',
    date: '2026-10-24',
    customerName: 'Daniel Craig',
    customerEmail: 'daniel.craig@astorhotel.com',
    description: 'Catering: 50 Assorted Mini Brioche Sandwiches',
    type: 'DIRECT_PAYMENT',
    amount: 220.00,
    currency: 'USD',
    status: 'PAID',
    paypalUrl: 'https://www.sandbox.paypal.com/activity/payment/TX-88219-008'
  },
  {
    id: 'TX-88219-009',
    date: '2026-10-23',
    customerName: 'Natasha Romanoff',
    customerEmail: 'natasha@shieldops.gov',
    description: 'Espresso Bean Truffles & Praline Box (24 count)',
    type: 'DIRECT_PAYMENT',
    amount: 48.00,
    currency: 'USD',
    status: 'PAID',
    paypalUrl: 'https://www.sandbox.paypal.com/activity/payment/TX-88219-009'
  },
  {
    id: 'TX-88219-010',
    date: '2026-10-23',
    customerName: 'Bruce Wayne',
    customerEmail: 'bruce@waynefoundations.org',
    description: 'Charity Gala 4-Tier Grand Black Velvet & Gold Cake',
    type: 'DIRECT_PAYMENT',
    amount: 450.00,
    currency: 'USD',
    status: 'PAID',
    paypalUrl: 'https://www.sandbox.paypal.com/activity/payment/TX-88219-010'
  },
  {
    id: 'INV2-9842-1007',
    date: '2026-10-22',
    customerName: 'Barry Allen',
    customerEmail: 'barry.allen@centralcitylab.org',
    description: 'Speed-Fuel Protein Granola Bars & Energy Oat Bites (Bulk)',
    type: 'INVOICE',
    amount: 60.00,
    currency: 'USD',
    status: 'PAID',
    paypalUrl: 'https://www.sandbox.paypal.com/invoice/p/#INV2-9842-1007'
  },
  {
    id: 'TX-88219-011',
    date: '2026-10-22',
    customerName: 'Diana Prince',
    customerEmail: 'diana@themiscira-museum.org',
    description: 'Greek Honey & Walnut Baklava Gift Tin',
    type: 'DIRECT_PAYMENT',
    amount: 42.00,
    currency: 'USD',
    status: 'PAID',
    paypalUrl: 'https://www.sandbox.paypal.com/activity/payment/TX-88219-011'
  },
  {
    id: 'TX-88219-012',
    date: '2026-10-20',
    customerName: 'Clark Kent',
    customerEmail: 'clark.kent@dailyplanet.news',
    description: 'Homestyle Cinnamon Apple Pie (Fresh Baked)',
    type: 'DIRECT_PAYMENT',
    amount: 32.00,
    currency: 'USD',
    status: 'PAID',
    paypalUrl: 'https://www.sandbox.paypal.com/activity/payment/TX-88219-012'
  },
  {
    id: 'INV2-9842-1008',
    date: '2026-10-19',
    customerName: 'Wanda Maximoff',
    customerEmail: 'wanda@westviewbakes.org',
    description: 'Scarlet Berry Tartlets & Vanilla Bean Custard (30 count)',
    type: 'INVOICE',
    amount: 85.00,
    currency: 'USD',
    status: 'PAID',
    paypalUrl: 'https://www.sandbox.paypal.com/invoice/p/#INV2-9842-1008'
  },
  {
    id: 'TX-88219-013',
    date: '2026-10-18',
    customerName: 'Peter Parker',
    customerEmail: 'peter.parker@dailybugle.com',
    description: 'Classic NY Cheesecake Slice Bundle & Pizza Focaccia',
    type: 'DIRECT_PAYMENT',
    amount: 24.50,
    currency: 'USD',
    status: 'PAID',
    paypalUrl: 'https://www.sandbox.paypal.com/activity/payment/TX-88219-013'
  },
  {
    id: 'TX-88219-014',
    date: '2026-10-17',
    customerName: 'Tony Stark',
    customerEmail: 'tony@starkindustries.com',
    description: 'VIP Espresso Machine Bakery Bean Subscription (3 Months)',
    type: 'DIRECT_PAYMENT',
    amount: 180.00,
    currency: 'USD',
    status: 'PAID',
    paypalUrl: 'https://www.sandbox.paypal.com/activity/payment/TX-88219-014'
  },
  {
    id: 'INV2-9842-1009',
    date: '2026-10-16',
    customerName: 'Stephen Strange',
    customerEmail: 'stephen@sanctumbakery.org',
    description: 'Earl Grey & Lavender Tea Cakes (Bulk Catering)',
    type: 'INVOICE',
    amount: 72.00,
    currency: 'USD',
    status: 'PAID',
    paypalUrl: 'https://www.sandbox.paypal.com/invoice/p/#INV2-9842-1009'
  },
  {
    id: 'TX-88219-015',
    date: '2026-10-15',
    customerName: 'Carol Danvers',
    customerEmail: 'carol.danvers@avengerspace.org',
    description: 'Lemon Meringue Tart & Citrus Shortbread Gift Set',
    type: 'DIRECT_PAYMENT',
    amount: 38.00,
    currency: 'USD',
    status: 'PAID',
    paypalUrl: 'https://www.sandbox.paypal.com/activity/payment/TX-88219-015'
  },
  {
    id: 'INV2-9842-1010',
    date: '2026-10-14',
    customerName: 'Arthur Curry',
    customerEmail: 'arthur.curry@atlantisevents.com',
    description: 'Sea Salt Caramel Cupcake Tower (48 count)',
    type: 'INVOICE',
    amount: 120.00,
    currency: 'USD',
    status: 'PAID',
    paypalUrl: 'https://www.sandbox.paypal.com/invoice/p/#INV2-9842-1010'
  }
];

const CUSTOMER_POOL = [
  { name: 'Sarah Miller', email: 'sarah.miller@example.com' },
  { name: 'David Kim', email: 'david.kim@techstart.io' },
  { name: 'Elena Vance', email: 'elena.vance@studioart.com' },
  { name: 'Sam Wilson', email: 'sam.wilson@falconair.com' },
  { name: 'Marcus Thorne', email: 'marcus.t@apexlogistics.com' },
  { name: 'Chloe Bennett', email: 'chloe.b@creativeagency.org' },
  { name: 'Oliver Queen', email: 'oliver.queen@arrowcap.com' },
  { name: 'Jessica Jones', email: 'jessica@aliasinvestigations.net' },
  { name: 'Priya Sharma', email: 'priya.sharma@innovate.co' },
  { name: 'Rahul Mehta', email: 'rahul.mehta@fintechlab.com' },
  { name: 'Aman Gupta', email: 'aman.gupta@soundwave.io' },
  { name: 'Bruce Wayne', email: 'bruce@wayneenterprises.com' },
  { name: 'Diana Prince', email: 'diana.prince@themiscira.org' },
  { name: 'Barry Allen', email: 'barry.allen@centralcitylabs.gov' },
  { name: 'Clark Kent', email: 'clark.kent@dailyplanet.com' },
  { name: 'Natasha Romanoff', email: 'natasha@redroomstudios.com' },
  { name: 'Peter Parker', email: 'peter.parker@dailybugle.net' },
  { name: 'Wanda Maximoff', email: 'wanda@westviewarts.org' },
  { name: 'Tony Stark', email: 'tony@starkindustries.com' },
  { name: 'Stephen Strange', email: 'stephen@sanctumbakery.org' },
  { name: 'Carol Danvers', email: 'carol.danvers@avengerspace.org' },
  { name: 'Arthur Curry', email: 'arthur.curry@atlantisevents.com' },
  { name: 'Maya Lin', email: 'maya.lin@architectstudio.com' },
  { name: 'Lucas Scott', email: 'lucas.scott@treepresents.com' },
  { name: 'Zoe Kravitz', email: 'zoe@highfidelity.net' }
];

const BAKERY_ITEMS = [
  { desc: '3 Boxes of Artisan Vanilla & Berry Cupcakes (12pk each)', price: 75.00, type: 'INVOICE' },
  { desc: 'Executive Breakfast Pastry Platter (Croissants, Danishes, Brioche)', price: 110.00, type: 'INVOICE' },
  { desc: 'Custom Hand-Painted Macaron Tower (60 pcs)', price: 95.00, type: 'INVOICE' },
  { desc: 'SweetCrumb Handcrafted Ceramic Coffee Mug & Cinnamon Roll Bundle', price: 35.00, type: 'DIRECT_PAYMENT' },
  { desc: 'Artisan Sourdough Loaf 4-Week Bread Subscription', price: 55.00, type: 'DIRECT_PAYMENT' },
  { desc: '3-Tier Floral Buttercream Wedding Cake Deposit', price: 65.00, type: 'DIRECT_PAYMENT' },
  { desc: 'Gluten-Free Raspberry Cheesecake (9 inch)', price: 45.00, type: 'DIRECT_PAYMENT' },
  { desc: 'Dark Roast Cold Brew Jug & Double Espresso Beans (1kg)', price: 20.00, type: 'DIRECT_PAYMENT' },
  { desc: 'Custom Red Velvet 2-Tier Birthday Cake with Gold Foil', price: 145.00, type: 'INVOICE' },
  { desc: 'Weekly Fresh Croissant & Danish Box (Office Delivery)', price: 40.00, type: 'INVOICE' },
  { desc: 'Artisan Sourdough Loaves & Herb Focaccia Catering Pack', price: 40.00, type: 'INVOICE' },
  { desc: 'Matcha & White Chocolate Scones Box (16 pcs)', price: 48.00, type: 'INVOICE' },
  { desc: 'Belgian Chocolate Ganache Brownie Platter (24 squares)', price: 60.00, type: 'DIRECT_PAYMENT' },
  { desc: 'Rustic Apple Cinnamon Galette & Pecan Tart Bundle', price: 50.00, type: 'INVOICE' },
  { desc: 'Cold Pressed Berry Lemonade & Pastry Bento Boxes (10pk)', price: 85.00, type: 'INVOICE' },
  { desc: 'VIP Espresso Machine Bakery Bean Subscription (3 Months)', price: 180.00, type: 'DIRECT_PAYMENT' },
  { desc: 'Earl Grey & Lavender Tea Cakes (Bulk Catering)', price: 72.00, type: 'INVOICE' },
  { desc: 'Lemon Meringue Tart & Citrus Shortbread Gift Set', price: 38.00, type: 'DIRECT_PAYMENT' },
  { desc: 'Sea Salt Caramel Cupcake Tower (48 count)', price: 120.00, type: 'INVOICE' },
  { desc: 'Pain au Chocolat & Almond Croissant Weekend Box (12pk)', price: 52.00, type: 'INVOICE' },
  { desc: 'Honey Fig & Goat Cheese Brioche Tartlets', price: 68.00, type: 'DIRECT_PAYMENT' },
  { desc: 'Pistachio Cardamom Babka Loaves (Set of 2)', price: 44.00, type: 'INVOICE' },
  { desc: 'Strawberry Shortcake Mason Jar Desserts (20pk)', price: 90.00, type: 'INVOICE' },
  { desc: 'Celebration Sourdough Focaccia with Edible Flower Art', price: 85.00, type: 'DIRECT_PAYMENT' },
  { desc: 'French Butter Croissant Tower for Gala Brunch', price: 135.00, type: 'INVOICE' }
];

export function generateDynamicBakeryTransactions(): Transaction[] {
  const result: Transaction[] = [];
  const runId = Math.floor(1000 + Math.random() * 9000);
  
  // Create a randomized order of customers
  const shuffledCustomers = [...CUSTOMER_POOL].sort(() => 0.5 - Math.random());
  
  // Define status distribution to match realistic bakery finances
  const statuses: Array<'OVERDUE' | 'PAID' | 'REFUNDED' | 'SENT'> = [
    'OVERDUE', 'OVERDUE', 'OVERDUE',
    'PAID', 'PAID', 'PAID', 'PAID', 'PAID', 'PAID', 'PAID', 'PAID', 'PAID', 'PAID',
    'REFUNDED', 'REFUNDED', 'REFUNDED', 'REFUNDED',
    'SENT', 'SENT', 'SENT', 'SENT', 'SENT', 'SENT', 'SENT', 'SENT'
  ].sort(() => 0.5 - Math.random()) as any;

  for (let i = 0; i < 25; i++) {
    const cust = shuffledCustomers[i % shuffledCustomers.length];
    const item = BAKERY_ITEMS[i % BAKERY_ITEMS.length];
    const status = statuses[i];
    const isInvoice = item.type === 'INVOICE' || status === 'OVERDUE' || status === 'SENT';
    const id = isInvoice ? `INV2-${runId}-${1001 + i}` : `TX-${runId}-${String(i + 1).padStart(3, '0')}`;
    const day = 25 - Math.floor(i * 0.4);
    const date = `2026-10-${String(Math.max(1, day)).padStart(2, '0')}`;
    
    // Vary amount slightly around base price
    const variance = (Math.random() * 10 - 5);
    const amount = Math.max(15, Math.round((item.price + variance) * 100) / 100);

    result.push({
      id,
      date,
      customerName: cust.name,
      customerEmail: cust.email,
      description: item.desc,
      type: isInvoice ? 'INVOICE' : 'DIRECT_PAYMENT',
      amount,
      currency: 'USD',
      status,
      isOverdue: status === 'OVERDUE',
      dueDate: status === 'OVERDUE' ? `2026-10-${String(Math.max(1, day - 10)).padStart(2, '0')}` : undefined,
      paypalUrl: isInvoice 
        ? `https://www.sandbox.paypal.com/invoice/p/#${id}`
        : `https://www.sandbox.paypal.com/activity/payment/${id}`,
      notes: status === 'OVERDUE' ? 'Late payment pending reminder' : undefined
    });
  }

  return result;
}
