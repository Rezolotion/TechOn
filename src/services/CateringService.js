/**
 * Dynamic Catering & Cafe Management Service
 */

export class CateringService {
  constructor() {
    this.menu = [
      { id: 'cat-1', name: 'پکیج پذیرایی استاندارد (اسپرسو/چای + کیک تازه)', category: 'PACKAGE', price: 65000, isAvailable: true },
      { id: 'cat-2', name: 'پکیج پذیرایی VIP (آبمیوه طبیعی + فینگرفود + شیرینی و قهوه)', category: 'PACKAGE', price: 140000, isAvailable: true },
      { id: 'cat-3', name: 'قهوه دمی تخصصی (کمکس/V60)', category: 'BEVERAGE_HOT', price: 75000, isAvailable: true },
      { id: 'cat-4', name: 'آبمیوه طبیعی فصل', category: 'BEVERAGE_COLD', price: 55000, isAvailable: true },
      { id: 'cat-5', name: 'سینی فینگرفود گرم (۲۰ عددی)', category: 'SNACK', price: 380000, isAvailable: true },
      { id: 'cat-6', name: 'ساندویچ کلاب بوقلمون و پنیر گودا', category: 'MEAL', price: 95000, isAvailable: true }
    ];
  }

  getMenu(onlyAvailable = true) {
    return onlyAvailable ? this.menu.filter(item => item.isAvailable) : this.menu;
  }

  getItem(itemId) {
    return this.menu.find(i => i.id === itemId);
  }

  addItem(itemData) {
    const newItem = {
      id: `cat-${Date.now()}`,
      name: itemData.name,
      category: itemData.category || 'SNACK',
      price: Number(itemData.price) || 0,
      isAvailable: itemData.isAvailable !== false
    };
    this.menu.push(newItem);
    return newItem;
  }

  updateItem(itemId, updateData) {
    const item = this.getItem(itemId);
    if (!item) throw new Error('آیتم منو یافت نشد');
    if (updateData.name) item.name = updateData.name;
    if (updateData.price !== undefined) item.price = Number(updateData.price);
    if (updateData.isAvailable !== undefined) item.isAvailable = Boolean(updateData.isAvailable);
    if (updateData.category) item.category = updateData.category;
    return item;
  }

  calculateCateringTotal(orderItems = []) {
    let total = 0;
    const detailedItems = [];

    for (const order of orderItems) {
      const menuItem = this.getItem(order.itemId);
      if (!menuItem) {
        throw new Error(`آیتم با شناسه ${order.itemId} معتبر نیست`);
      }
      if (!menuItem.isAvailable) {
        throw new Error(`آیتم "${menuItem.name}" در حال حاضر ناموجود است`);
      }
      const count = Math.max(1, Number(order.quantity) || 1);
      const itemSubtotal = menuItem.price * count;
      total += itemSubtotal;
      detailedItems.push({
        id: menuItem.id,
        name: menuItem.name,
        unitPrice: menuItem.price,
        quantity: count,
        subtotal: itemSubtotal
      });
    }

    return { total, detailedItems };
  }
}
