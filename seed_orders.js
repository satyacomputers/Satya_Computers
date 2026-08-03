const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const dummyOrders = [
    {
      orderId: 'ORD-1001',
      companyName: 'Satya Infotech',
      contactPerson: 'Venkateswar Reddy',
      email: 'venkat@satyainfotech.com',
      phone: '+91 9876543210',
      products: 'Dell Latitude 5480 x 10, HP Elitebook 840 G3 x 5',
      totalUnits: 15,
      estimatedValue: 150000,
      status: 'Pending',
      notes: 'Urgent requirement for new office setup.'
    },
    {
      orderId: 'ORD-1002',
      companyName: 'Computers & More',
      contactPerson: 'Sandeep Sharma',
      email: 'sandeep@compmore.in',
      phone: '+91 9123456789',
      products: 'Macbook Pro A1708 x 2',
      totalUnits: 2,
      estimatedValue: 35000,
      status: 'Confirmed',
      notes: 'Standard bulk pricing expected.'
    },
    {
       orderId: 'ORD-1003',
       companyName: 'Reliance Digital',
       contactPerson: 'Rajesh Kumar',
       email: 'rajesh.kumar@reliance.com',
       phone: '+91 8888888888',
       products: 'Lenovo ThinkPad T470 x 20',
       totalUnits: 20,
       estimatedValue: 400000,
       status: 'Quote Sent',
       notes: 'Requested for detailed specification sheet.'
    }
  ];

  for (const order of dummyOrders) {
    await prisma.order.upsert({
      where: { orderId: order.orderId },
      update: order,
      create: order
    });
    console.log(`Upserted Order: ${order.orderId}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
