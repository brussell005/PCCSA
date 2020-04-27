/**
 * AJAX add new items to items list on save.
 */
const doAddItem = async (e) => {
    e.preventDefault();
    inventory._addItemEventHandler();
};