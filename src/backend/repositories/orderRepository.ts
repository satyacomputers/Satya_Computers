import { libsql as client } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export interface OrderInput {
  fullName: string;
  email?: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  cartItems: any[];
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId?: string;
}

export class OrderRepository {
  public async create(data: OrderInput): Promise<string> {
    const orderId = 'SATYA-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const productsString = JSON.stringify(data.cartItems);

    await client.execute({
      sql: `INSERT INTO "CustomerOrder" (
        id, orderId, customerName, email, phone, address, 
        city, state, pincode, products, totalAmount, 
        paymentMethod, paymentStatus, orderStatus, 
        transactionId, createdAt, updatedAt
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      args: [
        uuidv4(),
        orderId,
        data.fullName,
        data.email || 'Not Provided',
        data.whatsapp,
        data.address,
        data.city,
        data.state,
        data.pincode,
        productsString,
        data.totalPrice,
        data.paymentMethod,
        data.paymentStatus,
        'Processing',
        data.transactionId || null
      ],
    });

    return orderId;
  }
}

export const orderRepository = new OrderRepository();
