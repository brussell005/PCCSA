const itemsService = new ItemsService();
const inventory = new InventoryList(itemsService);

inventory.init();
