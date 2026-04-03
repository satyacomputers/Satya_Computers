import { google } from 'googleapis';

/**
 * @layer Service
 * @description Master synchronization engine that maps all Satya Computers business data 
 * into a centralized Google Sheets repository in real-time.
 */
export class GoogleSheetsService {
  private readonly sheetId = "1iivt2ZgaJn34tIT0oGZC-Ds92_Az8M6qoOjJjn5BqbI";
  private readonly webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  
  private getAuthClient() {
    try {
      const credsRaw = process.env.GOOGLE_SHEETS_CREDENTIALS;
      if (!credsRaw) return null;
      
      const credentials = JSON.parse(credsRaw);
      return new google.auth.JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });
    } catch (e) {
      return null;
    }
  }

  public async appendDataToSheet(tabName: string, data: any[]): Promise<void> {
    console.log(`[SYS-READY] [SHEETS-DIAGNOSTIC]: Preparing packet for [${tabName}] ->`, data);

    // PATH 1: Webhook Fallback (Fastest Setup)
    if (this.webhookUrl) {
      try {
        await fetch(this.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tab: tabName, values: data })
        });
        console.log(`[SYS-AUTH] [WEBHOOK-SYNC]: Pushed via Google Apps Script Webhook.`);
        return;
      } catch (e) {
        console.warn(`[SYS-WARN] [WEBHOOK-ERROR]: Webhook failed. Crossing to API path...`);
      }
    }

    // PATH 2: Professional API
    const auth = this.getAuthClient();
    if (!auth) {
      console.warn('[CRITICAL-NOTICE]: Google Sheets Sync is STANDBY. (Add GOOGLE_SHEETS_CREDENTIALS or GOOGLE_SHEET_WEBHOOK_URL to .env)');
      return;
    }

    try {
      const sheets = google.sheets({ version: 'v4', auth });
      await sheets.spreadsheets.values.append({
        spreadsheetId: this.sheetId,
        range: `${tabName}!A:Z`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [data] },
      });
      console.log(`[SYS-AUTH] [API-SYNC]: Data successfully appended to [${tabName}].`);
    } catch (err: any) {
      console.error(`[SYS-FAIL] [API-ERROR]: ${err.message}`);
    }
  }

  public async syncB2COrder(orderData: any): Promise<void> {
    const row = [
      orderData.orderId || orderData.id,
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      orderData.fullName || orderData.customerName,
      orderData.whatsapp || orderData.customerPhone,
      `₹${(orderData.totalPrice || orderData.totalAmount || 0).toLocaleString()}`,
      orderData.status || orderData.paymentStatus || 'Pending',
      orderData.paymentMethod || 'UPI',
      orderData.address || 'POS-STORE'
    ];
    await this.appendDataToSheet('Orders (B2C)', row);
  }

  public async syncB2BOrder(order: any): Promise<void> {
    const row = [
      order.orderId || order.id,
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      order.fullName || order.companyName,
      order.customerPhone || order.phone,
      `₹${(order.totalPrice || order.estimatedValue || 0).toLocaleString()}`,
      order.status || 'Pending',
      order.paymentMethod || 'NET-WIRE',
      order.address || 'Enterprise'
    ];
    await this.appendDataToSheet('Orders (B2B)', row);
  }

  public async syncProduct(product: any): Promise<void> {
    const row = [
      product.id,
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      product.name,
      product.brand || 'Hardware',
      product.price,
      product.stock || 0
    ];
    await this.appendDataToSheet('Inventory', row);
  }

  public async syncAnnouncement(ann: any): Promise<void> {
    const row = [
      ann.id,
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      ann.title,
      ann.type,
      ann.status
    ];
    await this.appendDataToSheet('Announcements', row);
  }

  public async syncOffer(offer: any): Promise<void> {
    const row = [
      offer.id,
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      offer.title,
      offer.code,
      offer.discount,
      offer.isActive ? 'Active' : 'Disabled'
    ];
    await this.appendDataToSheet('Offers', row);
  }

  public async syncTeamMember(member: any): Promise<void> {
    const row = [
      member.username,
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      member.role,
      'System Admin'
    ];
    await this.appendDataToSheet('Admins', row);
  }
}

export const googleSheetsService = new GoogleSheetsService();
