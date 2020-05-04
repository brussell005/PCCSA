const itemsService = new ItemsService();
const inventory = new InventoryList(itemsService);

describe('Inventory App', () => {
  it('should initialize some HTML', () => {
    spyOn(inventory, 'init');
    inventory.init();

    expect(inventory.init).toHaveBeenCalled();
  });

  it('should add an item', async () => {
    const newItem = {
      item_id: 0,
      item_name: 'Corn',
      status: 'in stock',
      created_date: '2020-04-14 22:50:32',
    };
    const addItemServiceSpy = spyOn(itemsService, 'addItems');

    expect(inventory.items.length).toBe(0);

    await inventory.addItems(newItem);

    expect(addItemServiceSpy).toHaveBeenCalled();
    expect(inventory.items.length).toBe(1);
  });

  it('should delete an item', async () => {
    const existingItem = {
      item_id: 0,
      item_name: 'Corn',
      status: 'in stock',
      created_date: '2020-04-14 22:50:32',
    };
    const deleteItemServiceSpy = spyOn(itemsService, 'deleteItem');

    expect(inventory.items.length).toBe(1);

    await inventory.deleteItem(existingItem.item_id);

    expect(deleteItemServiceSpy).toHaveBeenCalled();
    expect(inventory.items.length).toBe(0);
  });
});
