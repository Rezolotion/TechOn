import { CateringRepository } from '../repositories/CateringRepository.js';

export class CateringService {
  constructor(repository = new CateringRepository()) {
    this.repository = repository;
  }

  getMenu() {
    return this.repository.findAll();
  }

  calculateCateringTotal(orderItems = []) {
    let total = 0;
    const detailedItems = [];

    if (!Array.isArray(orderItems)) {
      return { total: 0, detailedItems: [] };
    }

    for (const order of orderItems) {
      const item = this.repository.findById(order.itemId);
      if (item && order.quantity > 0) {
        const itemSubtotal = item.price * Number(order.quantity);
        total += itemSubtotal;
        detailedItems.push({
          itemId: item.id,
          name: item.name,
          category: item.category,
          unitPrice: item.price,
          quantity: Number(order.quantity),
          subtotal: itemSubtotal
        });
      }
    }

    return { total, detailedItems };
  }

  addNewItem(itemData) {
    if (!itemData.name || !itemData.price || itemData.price <= 0) {
      throw new Error('نام و قیمت معتبر برای آیتم جدید الزامی است.');
    }
    const id = `cat-${Date.now()}`;
    return this.repository.addItem({
      id,
      name: itemData.name,
      category: itemData.category || 'SNACK',
      price: Number(itemData.price),
      available: 1
    });
  }
}
