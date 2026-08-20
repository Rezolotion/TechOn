export class CateringController {
  constructor(cateringService) {
    this.cateringService = cateringService;
  }

  getMenu() {
    const menu = this.cateringService.getMenu();
    return { success: true, menu };
  }

  addItem(body) {
    const item = this.cateringService.addNewItem(body);
    return { success: true, item };
  }
}
