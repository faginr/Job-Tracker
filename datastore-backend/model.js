const gcds = require('./datastore')

// grab the datastore instance used for this project
const ds = gcds.datastore

// define function to add id to entities returned from DS
function fromStore (data) {
    let dataId = data[ds.KEY].id
    if (dataId === undefined || dataId === null) {
        dataId = data[ds.KEY].name
    } 
    data.id = dataId
    return data
}

/**
 * Posts a new entity to datastore that matches the newData object parameter. 
 * Returns this new entity with the "id" attribute added.
 * NOTE - use this function when wanting to supply ID for datastore manually.
 * If OK with DS assigning an ID instead, use postItem
 * @param {obj} newData 
 * @param {int} id 
 * @param {str} kind 
 * @returns 
 */
async function postItemManId(newData, id, kind) {
    // prepare the key based on kind - this will assign it to the right "table" - and manual id
    const newKey = ds.key([kind, id])

    // prepare the entity
    const entity = {
        key: newKey,
        data: newData
    }

    await ds.save(entity)

    newData.id = String(newKey.id)
    return newData
}

/**
 * Posts a new entity to datastore that matches the newData object parameter.
 * Returns this new entity with the "id" attribute added.
 * NOTE - use this function only if OK with datastore creating id automatically. 
 * If you need to assign a manual id, use postItemManId
 * @param {obj} newData 
 * @param {str} kind 
 * @returns Entity Object
 */
async function postItem(newData, kind) {
    // prepare the key based on kind - this will assign it to the right "table"
    const newKey = ds.key(kind)

    // prepare the entity
    const entity = {
        key: newKey,
        data: newData
    }

    await ds.save(entity)

    newData.id = newKey.id
    return newData
}

/**
 * Queries the kind group specified, projecting to keys only for faster query. 
 * Returns an array of entity keys.
 * @param {str} kind 
 * @returns Array of entity keys
 */
async function queryKeysOnly (kind) {
    const query = ds.createQuery(kind).select('__key__')
    const results = await ds.runQuery(query)
    return results[0]
}

/**
 * Returns a list of all entities in datastore within the kind group specified. 
 * Results are not paginated. If no entities exist, returns a blank array.
 * @param {str} kind 
 * @returns Array of entities
 */
async function getItemsNoPaginate(kind){
    let query = ds.createQuery(kind)
    const results = await ds.runQuery(query)
    let data = results[0]

    // convert the data to the desired format for return
    data = data.map(fromStore)

    return data
}

/**
 * Returns a list of all entities within the kind group specified. Results 
 * are paginated to 3 items per page. Returns an object like so:
 * {
 *   next: cursor_token,
 *   total: total items in kind,
 *   data: entities
 * }
 * @param {str} kind 
 * @param {str} pageCursor 
 * @returns Query Object
 */
async function getItemsPaginate (kind, pageCursor=undefined) {
    // first query only on key to get full count
    const totalResults = await queryKeysOnly(kind)
    const total = totalResults.length

    // now run paginated query
    let query = ds.createQuery(kind).limit(5)
    if (pageCursor !== undefined){
        query = query.start(pageCursor)
    }

    const results = await ds.runQuery(query)
    let data = results[0]
    const cursorInfo = results[1]
    let token = null

    // convert the data to the desired format for return
    data = data.map(fromStore)

    // set the token value for return if more results can be obtained
    if (cursorInfo.moreResults !== ds.NO_MORE_RESULTS) {
        token = cursorInfo.endCursor
    }

    let returnObj = {next: token, total: total}
    returnObj[kind] = data

    return returnObj
}

/**
 * Returns an array of datastore entities whose filterProp = filterVal. If 
 * no entities are found, returns an empty array. Returns the entities within 
 * an object like so: {next: cursor_token, total: total items that matched, 
 * data: entities}. Results are paginated to 5 results per page.
 * @param {str} kind 
 * @param {str} filterProp 
 * @param {any} filterVal 
 * @returns Array of entities
 */
async function getFilteredItemsPaginated(kind, filterProp, filterVal, pageCursor=undefined) {
    // first query with just filter to get full count
    const totalResultsQuery = await getFilteredItems(kind, filterProp, filterVal)
    const total = totalResultsQuery.length

    // now run paginated query
    let query = ds.createQuery(kind).filter(filterProp, '=', filterVal).limit(5)
    if (pageCursor !== undefined){
        query = query.start(pageCursor)
    }
    
    const results = await ds.runQuery(query)
    let data = results[0]
    const cursorInfo = results[1]
    let token = null

    // convert the data to the desired format for return
    data = data.map(fromStore)

    // set the token value for return if more results can be obtained
    if (cursorInfo.moreResults !== ds.NO_MORE_RESULTS) {
        token = cursorInfo.endCursor
    }

    let returnObj = {next: token, total: total}
    returnObj[kind] = data

    return returnObj
}

/**
 * Returns an array of datastore entities whose filterProp = filterVal. 
 * If no entities are found, returns an empty array.
 * @param {str} kind 
 * @param {str} filterProp 
 * @param {any} filterVal 
 * @returns Array of entities
 */
 async function getFilteredItems(kind, filterProp, filterVal) {
    const query = ds.createQuery(kind).filter(filterProp, '=', filterVal)
    const results = await ds.runQuery(query)
    let data = results[0]
    return data.map(fromStore)
}

/**
 * Returns an array with a single entity from datastore whose id matches the 
 * id parameter. If no match found, array is empty.
 * @param {str} kind 
 * @param {str} id 
 * @param {bool} manualId 
 * @returns Array with single entity
 */
async function getItemByID(kind, id){
    // manually create matching key
    let manKey = ds.key([kind, parseInt(id, 10)])

    const results = await ds.get(manKey)

    if (results[0] === null || results[0] === undefined) {
        return results
    }
    
    return results.map(fromStore)
}

/**
 * Deletes an item from the datastore that matches the kind and id passed as parameters.
 * @param {str} kind 
 * @param {str} id 
 * @returns 
 */
async function deleteItem(kind, id) {
    // manually create matching key
    const manKey = ds.key([kind, parseInt(id, 10)])
    const response = await ds.delete(manKey)

    return response
}

/**
 * Deletes all items of the given kind that match the filter conditions passed.
 * @param {str} kind 
 * @param {str} id 
 * @returns a list of matching keys
 */
async function deleteMatchingItemsFromKind(kind, filter_prop, filter_val) {
    // get keys of items that match the user_id
    const query = ds.createQuery(kind).filter(filter_prop, filter_val).select("__key__")
    const keys = await ds.runQuery(query)

    // perform batch delete
    await ds.delete(keys[0])
    return keys[0]
}

/**
 * Updates an item from the "kind" entity group that matches the ID in the
 * newData object. Returns a single object (not array)
 * NOTE - newData must have an "id" field that contains the id of the datastore 
 * entity to be updated.
 * @param {object} newData 
 * @param {str} kind 
 * @returns Updated Entity
 */
async function updateItem(newData, kind) {
    // manually create matching key 
    let manKey = null
    let existId = newData.id
    manKey = ds.key([kind, parseInt(newData.id, 10)])

    // prepare the entity object
    delete newData.id

    const newEntity = {
        key: manKey,
        data: newData
    }

    // update the datastore item and return the key
    await ds.save(newEntity)
    newData.id = existId
    return newData
}

module.exports = {
    postItem,
    postItemManId,
    getItemByID,
    getFilteredItemsPaginated,
    getFilteredItems,
    getItemsPaginate,
    getItemsNoPaginate,
    deleteItem,
    deleteMatchingItemsFromKind,
    updateItem
}