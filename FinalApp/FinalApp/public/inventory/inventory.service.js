/**
 * @class InventoryList
 *
 * Creates a list of items and updates a list
 */

class InventoryList {
    items = [];
    itemsService;
  
    constructor(itemsService) {
      this.itemsService = itemsService;
    }
  
  init() {
    this.render();
  }

/**
   * DOM renderer for building the list row item.
   * Uses bootstrap classes with some custom overrides.
   *
   * {@link https://getbootstrap.com/docs/4.4/components/list-group/}
   * @example
   * <li class="list-group-item">
   *   <button class="btn btn-secondary" onclick="deleteTask(e, index)">X</button>
   *   <span>Task name</span>
   *   <span>pending</span>
   *   <span>date create</span>
   * </li>
   */
  _renderListRowItem = (item) => {
    const listGroupItem = document.createElement('li');
    listGroupItem.id = `item-${item.itemId}`;
    listGroupItem.className = 'list-group-item';

    const deleteBtn = document.createElement('button');
    const deleteBtnTxt = document.createTextNode('X');
    deleteBtn.id = 'delete-btn';
    deleteBtn.className = 'btn btn-secondary';
    deleteBtn.addEventListener('click', this._deleteEventHandler(item.itemId));
    deleteBtn.appendChild(deleteBtnTxt);

    const itemNameSpan = document.createElement('span');
    const itemName = document.createTextNode(item.item_name);
    itemNameSpan.appendChild(itemName);

    const itemStatusSpan = document.createElement('span');
    const itemStatus = document.createTextNode(item.status);
    itemStatusSpan.append(itemStatus);

    const itemDateSpan = document.createElement('span');
    const itemDate = document.createTextNode(item.created_date);
    itemDateSpan.append(itemDate);

    // add list item's details
    listGroupItem.append(deleteBtn);
    listGroupItem.append(itemNameSpan);
    listGroupItem.append(itemStatusSpan);
    listGroupItem.append(itemDateSpan);

    return listGroupItem;
  };

  /**
   * DOM renderer for assembling the list items then mounting them to a parent node.
   */
  _renderList = () => {
    // get the "Loading..." text node from parent element
    const itemsDiv = document.getElementById('items');
    const loadingDiv = itemsDiv.childNodes[0];
    const fragment = document.createDocumentFragment();
    const ul = document.createElement('ul');
    ul.id = 'items-list';
    ul.className = 'list-group list-group-flush checked-list-box';

    this.items.map((item) => {
      const listGroupRowItem = this._renderListRowItem(item);

      // add entire list item
      ul.appendChild(listGroupRowItem);
    });

    fragment.appendChild(ul);
    itemsDiv.replaceChild(fragment, loadingDiv);
  };

  /**
   * DOM renderer for displaying a default message when a user has an empty list.
   */
  _renderMsg = () => {
    const itemsDiv = document.getElementById('items');
    const loadingDiv = itemsDiv.childNodes[1];
    const listParent = document.getElementById('items-list');
    const msgDiv = this._createMsgElement('Add some new items please!');

    if (itemsDiv) {
      itemsDiv.replaceChild(msgDiv, loadingDiv);
    } else {
      itemsDiv.replaceChild(msgDiv, listParent);
    }
  };

  /**
   * Pure function for adding a task.
   *
   * @param {Object} newItem - form's values as an object
   */
  addItems = async (newItem) => {
    try {
      const { item_name, status } = newItem;
      await this.itemsService.addItems({ item_name, status }); // we just want the name and status
      this.items.push(newItem); // push task with all it parts
    } catch (err) {
      console.log(err);
      alert('Unable to add item. Please try again later.');
    }
  };

  /**
   * DOM Event handler helper for adding a task to the DOM.
   *
   * @param {number} itemId - id of the task to delete
   */
  _addItemEventHandler = () => {
    const itemInput = document.getElementById('formInputItemName');
    const item_name = itemInput.value;

    const statusSelect = document.getElementById('formSelectStatus');
    const options = statusSelect.options;
    const selectedIndex = statusSelect.selectedIndex;
    const status = options[selectedIndex].text;

    // validation checks
    if (!item_name) {
      alert('Please enter an item name.');
      return;
    }

    const item = { item_name, status }; // assemble the new task parts
    const { newItem, newItemEl } = this._createNewItemEl(item); // add task to list

    this.addItems(newItem);

    const listParent = document.getElementById('items-list');

    if (listParent) {
      listParent.appendChild(newItemEl);
    } else {
      this._renderList();
    }
    itemInput.value = ''; // clear form text input
  };

  /**
   * Create the DOM element for the new task with all its parts.
   *
   * @param {Object} item - { task_name, status } partial status object
   */
  _createNewItemEl = (item) => {
    const itemId = this.items.length;
    const created_date = new Date().toISOString();
    const newItem = { ...item, itemId, created_date };
    const newItemEl = this._renderListRowItem(newItem);

    return { newItem, newItemEl };
  };

  /**
   * Pure function for deleting a task.
   *
   * @param {number} itemId - id for the task to be deleted
   */
  deleteItem = async (itemId) => {
    try {
      const res = await this.itemsService.deleteItem(itemId);
      this.items = this.items.filter((item) => item.item_id !== itemId);

      if (res !== null) {
        alert('Item deleted successfully!');
      }
      return res;
    } catch (err) {
      alert('Unable to delete item. Please try again later.');
    }
  };

  /**
   * DOM Event handler helper for deleting a task from the DOM.
   * This relies on a pre-existing in the list of items.
   *
   * @param {number} itemId - id of the task to delete
   */
  _deleteEventHandler = (itemId) => () => {
    const item = document.getElementById(`item-${itemId}`);
    item.remove(itemId);

    this.deleteItem(itemId).then(() => {
      if (!this.items.length) {
        this._renderMsg();
      }
    });
  };

  /**
   * Creates a message div block.
   *
   * @param {string} msg - custom message to display
   */
  _createMsgElement = (msg) => {
    const msgDiv = document.createElement('div');
    const text = document.createTextNode(msg);
    msgDiv.id = 'user-message';
    msgDiv.className = 'center';
    msgDiv.appendChild(text);

    return msgDiv;
  };

  render = async () => {
    const items = await this.itemsService.getItems();

    try {
      if (items.length) {
        this.items = items;
        this._renderList();
      } else {
        this._renderMsg();
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };
}
