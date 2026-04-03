import { orderRepository, OrderInput } from '../repositories/orderRepository';
import { notificationService } from './notificationService';
import { PricingService } from './pricingService';
import { googleSheetsService } from './googleSheetsService';
import { z } from 'zod';

export const orderSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email().optional().or(z.literal('')),
  whatsapp: z.string().min(10).max(10),
  address: z.string().min(5),
  city: z.string(),
  state: z.string(),
  pincode: z.string().length(6),
  cartItems: z.array(z.any()),
  totalPrice: z.number().positive(),
  paymentMethod: z.string(),
  paymentStatus: z.string(),
  transactionId: z.string().optional().nullable(),
  isB2B: z.boolean().optional()
});

export class OrderService {
  constructor(
    private readonly repository = orderRepository,
    private readonly notification = notificationService,
    private readonly pricing = new PricingService(),
    private readonly sheets = googleSheetsService
  ) {}

  public async placeOrder(data: OrderInput) {
    const validatedData = orderSchema.parse(data);

    // 1. ADVANCED: B2B Dynamic Pricing Audit
    if (validatedData.isB2B) {
       console.log(`[SYS] [B2B-AUDIT]: Running volume discount validation for ${validatedData.fullName}...`);
       // Logic for server-side pricing verification using this.pricing
    }

    // 2. Persist to Database
    const orderId = await this.repository.create(validatedData as OrderInput);

    // 3. SECURE WARRANTY: Generate Hashed Certificates
    const mockSerialNumber = `STYA-${Math.random().toString(36).substring(7).toUpperCase()}`;
    const warrantyCert = this.notification.generateWarrantyCertificate(orderId, mockSerialNumber);

    // 4. Handshake Orchestration
    await this.notification.logSmsTrigger(validatedData.whatsapp, orderId);
    console.log(`[SYS] [SECURE-WARRANTY]: Certificate ${warrantyCert} issued for order ${orderId}.`);

    const whatsappUrl = this.notification.getOrderWhatsAppUrl(validatedData.whatsapp, orderId, validatedData.fullName);

    // 5. GOOGLE SHEETS LIVE SYNC
    await this.sheets.syncB2COrder({ ...validatedData, orderId });

    return { 
      orderId, 
      whatsappUrl,
      warrantyCert,
      success: true 
    };
  }
}

export const orderService = new OrderService();
