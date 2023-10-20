require('isomorphic-fetch');

/**
 * @typedef {Object} ItemsHasPermissionsResponse
 * @property {Boolean} hasPermissions
 */

/**
 * @typedef {Array<String>} GetItemsWithPermissionsResponse
 * */

/**
 * @typedef {Object} ItemsPermissionsRawObject
 * @property {String} item
 * @property {String} itemType
 * @property {String} permission
 * @property {String} action
 * @property {String} group
 * @property {String} createdAt
 * @property {String} updatedAt
 * */

/**
 * @typedef {Object} GetItemsPermissionsObjectPermissions
 * @property {String} permission
 * @property {Array<String>} actions
 * */

/**
 * @typedef {Object} GetItemsPermissionsObject
 * @property {String} item
 * @property {Array<String>} itemTypes
 * @property {Array<GetItemsPermissionsObjectPermissions>} permissions
 * */

/**
 * @typedef {Array<GetItemsPermissionsObject>} GetItemsPermissionsResponse
 * */

/**
 * @typedef {Object} PermissionsWithActionsObject
 * @property {String} permission
 * @property {Array<String>} actions
 * */

/**
 * @typedef {Object} ItemsWithThePermissionsThatLinkThemObject
 * @property {String} item
 * @property {Array<String>} actions
 * @property {Array<String>} permissions
 * @property {Array<PermissionsWithActionsObject>} permissionsWithActions
 * */

/**
 * @typedef {Object} GetItemsWithPermissionsForItemsObject
 * @property {String} item
 * @property {Array<String>} itemsWithPermission
 * @property {Array<ItemsWithThePermissionsThatLinkThemObject>} itemsWithThePermissionsThatLinkThem
 * */

/**
 * @typedef {Array<GetItemsWithPermissionsForItemsObject>} GetItemsWithPermissionsForItemsResponse
 * */

/**
 * @typedef {Object} ItemsHasAccessToItemsObject
 * @property {String} from
 * @property {String} to
 * @property {Boolean} hasAccess
 * @property {Array<PermissionsWithActionsObject>} permissionsThatLinkThem
 * */

/**
 * @typedef {Array<ItemsHasAccessToItemsObject>} ItemsHasAccessToItemsResponse
 * */

/**
 * @typedef {Object} DeleteItems
 * @property {1} ok
 * @property {Number} deletedCount
 * @property {Number} n
 * */

/**
 * @typedef {DeleteItems} RemovePermissionsToItemsResponse
 * */

/**
 * @typedef {DeleteItems} RemoveItemsToGroupsResponse
 * */

/**
 * @typedef {DeleteItems} RemovePermissionsToGroupsResponse
 * */

/**
 * @typedef {Object} RemoveGroupsResponse
 * @property {DeleteItems} itemPermissions
 * @property {DeleteItems} permissions
 * @property {DeleteItems} items
 * @property {DeleteItems} groups
 * */


/**
 * @typedef {Object} AddGroupObjectData
 * @property {String} [name] [Optional] Group name
 * @property {String} [key] [Optional] Group key to be able to identify the group in api
 * @property {Object} [metadata] [Optional] Store somthing here if you need
 * */

/**
 * @typedef {Object} AddGroupsObject
 * @property {String} _id
 * @property {String} name
 * @property {String} key
 * @property {String} metadata
 * */

/**
 * @typedef {Array<AddGroupsObject>} GroupsResponse
 * */

/**
 * @typedef {Object} UpdateGroupsObjectData
 * @property {String} _id Group id
 * @property {String} key Group key to be able to identify the group in api
 * @property {String} [name] [Optional] Group name
 * @property {Object} [metadata] [Optional] Store somthing here if you need
 * */

/**
 * @typedef {Object} ListGroupsResponse
 * @property {GroupsResponse} items
 * @property {Number} count Number of items
 * @property {Number} totalCount Total number of items in DB
 * @property {Number} totalPages Number of pages for this size
 * @property {Number} page Current page
 * @property {Number} size Current size per page
 * @property {Number} nextPage What is the next page
 * @property {Number} prevPage What is the previous page
 * @property {Boolean} canGoNextPage true if have next page false if not
 * @property {Boolean} canGoPrevPage true if have previous page false if not
 * */


/**
 * @typedef {Object} DetailGroupsPermissionsObject
 * @property {String} permission
 * @property {Array<String>} actions
 * */

/**
 * @typedef {Object} DetailGroupsItemsObject
 * @property {String} item
 * @property {Array<String>} itemTypes
 * */

/**
 * @typedef {Object} DetailGroupsObject
 * @property {String} _id
 * @property {String} key
 * @property {String} name
 * @property {Object} metadata
 * @property {Array<DetailGroupsPermissionsObject>} permissions
 * @property {Array<DetailGroupsItemsObject>} items
 * */

/**
 * @typedef {Array<DetailGroupsObject>} DetailGroupsResponse
 * */


class AwesomePermissions {
    /**
     * Fetch helper functions
     * @private
     * */
    #fetch = null;
    /**
     * Api base url for init
     * @private
     * */
    #apiUrl = null;
    /**
     * Api version to use
     * @private
     * */
    #version = null;
    /**
     * AccessKey token to authenticate
     * @private
     * */
    #accessKey = null;
    /**
     * Define if use https or http for testing
     * @private
     * */
    #providerIPPrefix = null;

    constructor({ accessKey, version = 'v1', developMode }) {
        this.#fetch = {
            get: this.#request('GET'),
            post: this.#request('POST'),
            put: this.#request('PUT'),
            delete: this.#request('DELETE')
        };
        this.#apiUrl = developMode ? 'http://127.0.0.1:8080' : 'https://api.awesomepermissions.com';
        this.#version = version;
        this.#accessKey = accessKey;
        this.#providerIPPrefix = developMode ? 'http://' : 'https://';
        this.#init();
    }

    /**
     * Adds the permissions with the specified actions to the specified items
     * @async
     * @function
     * @name addPermissionsToItems
     * @param {Object} params
     * @param {Array<String>} params.items Any valid string, usually an id from your database.
     * @param {Array<String>} params.itemTypes Any valid string, usually the data type of the items you are going to add.
     * @param {Array<String>} params.permissions Any valid string, usually the name of what you want to give access to.
     * @param {Array<String>} params.actions Any valid string, usually the action you want to allow the item to perform on the other items to which it gives access by having the permission.
     * @param {Boolean} [params.ignoreDuplicateErrors] By default it is true if you specify false if any of the permissions to add already exists an error will be returned, in any case the permissions that do not exist will be added.
     * @return {Promise<Boolean>} true
     * @example
     * addPermissionsToItems({
     *     "items": ['user-id'],
     *     "itemTypes": ['user'],
     *     "permissions": ['image-id'],
     *     "actions": ['view'],
     *     "ignoreDuplicateErrors": true
     * });
     * */
    async addPermissionsToItems({ items, itemTypes, permissions, actions, ignoreDuplicateErrors = true }) {
        await this.#waitToIp();
        return this.#fetch.post(this.#getURL('/permissions/add-permissions-to-items'), {
            items,
            itemTypes,
            permissions,
            actions,
            ignoreDuplicateErrors
        });
    }

    /**
     * Only returns {hasPermissions: true} if all specified items have the specified permissions with the specified actions.
     * @async
     * @function
     * @name itemsHasPermissions
     * @param {Object} params
     * @param {Array<String>} params.items Any valid string, usually an id from your database.
     * @param {Array<String>} params.permissions Any valid string, usually the name of the thing you want to check for access to
     * @param {Array<String>} params.actions Any valid string, usually the action you want to check if you have access for the specified permission(s).
     * @return {Promise<ItemsHasPermissionsResponse>}
     * @example
     * itemsHasPermissions({
     *     "items": ['user-id'],
     *     "permissions": ['image-id'],
     *     "actions": ['edit']
     * });
     *
     * */
    async itemsHasPermissions({ items, permissions, actions }) {
        await this.#waitToIp();
        return this.#fetch.post(this.#getURL('/permissions/items-has-permissions'), { items, permissions, actions });
    }

    /**
     * Returns the items that have the permissions with the specified actions.
     *
     * Depending on the query mode ($or|$and) it returns items that have all permissions with those actions or all items
     * with any permissions with any of the actions.
     * @async
     * @function
     * @name getItemsWithPermissions
     * @param {Object} params
     * @param {Array<String>} params.permissions Any valid string, usually the name of the thing you want to check for access to
     * @param {Array<String>} params.actions Any valid string, usually the action you want to check if you have access for the specified permission(s).
     * @param {'$or'|'$and'} [params.mode] $or or $and string, Define how to check the permissions for get items.
     * @param {Boolean} [params.raw] Define if return raw permissions.
     * @return {Promise<GetItemsWithPermissionsResponse | Array<ItemsPermissionsRawObject>>}
     * @example
     * getItemsWithPermissions({
     *     "permissions": ['image-id'],
     *     "actions": ['edit'],
     *     "mode": "$or",
     *     "raw": true
     * });
     *
     * */
    async getItemsWithPermissions({ permissions, actions, mode = '$or', raw = false }) {
        await this.#waitToIp();
        return this.#fetch.post(this.#getURL('/permissions/get-items-with-permissions'), {
            permissions,
            actions,
            mode,
            raw
        });
    }

    /**
     * Returns for the specified items what types it has and what permissions with what actions.
     * @async
     * @function
     * @name getItemsPermissions
     * @param {Object} params
     * @param {Array<String>} params.items Items for which you want to obtain permissions
     * @param {Boolean} params.raw  Define if return raw permissions.
     * @return {Promise<GetItemsPermissionsResponse | Array<ItemsPermissionsRawObject>>}
     * @example
     * getItemsPermissions({
     *     "items": ['user-id'],
     *     "raw": false
     * });
     *
     * */
    async getItemsPermissions({ items, raw = false }) {
        await this.#waitToIp();
        return this.#fetch.post(this.#getURL('/permissions/get-items-permissions'), { items, raw });
    }

    /**
     * Retrieve the items that have access to the requested type of items, and at the same time, the requested items also have access to them.
     * @async
     * @function
     * @name getItemsWithPermissionsForItems
     * @param {Object} params
     * @param {Array<String>} params.items Items from which you want to obtain information about which other items have access.
     * @param {Array<String>} params.itemTypes Type of item from which you want to obtain information about which other items have access.
     * @param {Boolean} params.returnPermissionsThatLinkThem Retrieve the permissions that link one item to another
     * @return {Promise<GetItemsWithPermissionsForItemsResponse>}
     * @example
     * getItemsWithPermissionsForItems({
     *     "items": ['user-id'],
     *     "itemTypes": ['user'],
     *     "returnPermissionsThatLinkThem": false
     * });
     *
     * */
    async getItemsWithPermissionsForItems({ items, itemTypes, returnPermissionsThatLinkThem = true }) {
        await this.#waitToIp();
        return this.#fetch.post(this.#getURL('/permissions/get-items-with-permissions-for-items'), {
            items,
            itemTypes,
            returnPermissionsThatLinkThem
        });
    }

    /**
     * Returns for items and itemsToAccess if they have access to each other.
     * @async
     * @function
     * @name itemsHasAccessToItems
     * @param {Object} params
     * @param {Array<String>} params.items Items from
     * @param {Array<String>} params.itemsToAccess Items to
     * @param {Boolean} params.returnPermissionsThatLinkThem Retrieve the permissions that link one item to another
     * @return {Promise<ItemsHasAccessToItemsResponse>}
     * @example
     * itemsHasAccessToItems({
     *     "items": ['user-id'],
     *     "itemsToAccess": ['image-id'],
     *     "returnPermissionsThatLinkThem": true
     * });
     *
     * */
    async itemsHasAccessToItems({ items, itemsToAccess, returnPermissionsThatLinkThem = true }) {
        await this.#waitToIp();
        return this.#fetch.post(this.#getURL('/permissions/items-has-access-to-items'), {
            items,
            itemsToAccess,
            returnPermissionsThatLinkThem
        });
    }

    /**
     * Removes permissions to items
     * @async
     * @function
     * @name removePermissionsToItems
     * @param {Object} params
     * @param {Array<String>} params.items Any valid string, usually an id from your database.
     * @param {Array<String>} params.itemTypes Any valid string, usually the data type of the items you are going to add.
     * @param {Array<String>} params.permissions Any valid string, usually the name of what you want to give access to.
     * @param {Array<String>} params.actions Any valid string, usually the action you want to allow the item to perform on the other items to which it gives access by having the permission.
     * @return {Promise<RemovePermissionsToItemsResponse>}
     * @example
     * removePermissionsToItems({
     *     "items": ['user-id'],
     *     "permissions": ['image-id'],
     *     "itemTypes": ['user'],
     *     "actions": ['view']
     * });
     * */
    async removePermissionsToItems({ items, itemTypes, permissions, actions }) {
        await this.#waitToIp();
        return this.#fetch.post(this.#getURL('/permissions/remove-permissions-to-items'), {
            items,
            itemTypes,
            permissions,
            actions
        });
    }


    /**
     * Create new group for users with permissions
     * @async
     * @function
     * @name addGroups
     * @param {Array<AddGroupObjectData>} params
     * @return {Promise<GroupsResponse>}
     * @example
     * addGroups([
     *  {
     *      "name": "My group name",
     *      "key": "group-1",
     *      "metadata": {
     *          "my-custom-prop": "my-custom-value"
     *      }
     *  }
     * ]);
     * */
    async addGroups(params) {
        await this.#waitToIp();
        return this.#fetch.post(this.#getURL('/groups/add-groups'), params);
    }

    /**
     * Update groups data
     * Is required _id or key
     * @async
     * @function
     * @name updateGroups
     * @param {Array<UpdateGroupsObjectData>} params
     * @return {Promise<GroupsResponse>}
     * @example
     * updateGroups([
     *  {
     *      "name": "My group name",
     *      "key": "group-1",
     *      "metadata": {
     *          "my-custom-prop": "my-custom-value"
     *      }
     *  }
     * ]);
     * */
    async updateGroups(params) {
        await this.#waitToIp();
        return this.#fetch.post(this.#getURL('/groups/update-groups'), params);
    }

    /**
     * Add items to group (this adds current and future permissions to the added items)
     * Is required _id or key in groups field
     * @async
     * @function
     * @name addItemsToGroups
     * @param {Object} params
     * @param {Array<String>} params.groups Any valid string, _id or key groups.
     * @param {Array<String>} params.items Any valid string, usually an id from your database.
     * @param {Array<String>} params.itemTypes Any valid string, usually the data type of the items you are going to add.
     * @param {Boolean} [params.ignoreDuplicateErrors] By default it is true if you specify false if any of the permissions to add already exists an error will be returned, in any case the permissions that do not exist will be added.
     * @return {Promise<Boolean>}
     * @example
     * addItemsToGroups({
     *     "groups": ["group-key", "group-id"],
     *     "items": ["pepe", "juan"],
     *     "itemTypes": ['user'],
     *     "ignoreDuplicateErrors": true
     * });
     * */
    async addItemsToGroups({ groups, items, itemTypes, ignoreDuplicateErrors = true }) {
        await this.#waitToIp();
        return this.#fetch.post(this.#getURL('/groups/add-items'), { groups, items, itemTypes, ignoreDuplicateErrors });
    }

    /**
     * Add permissions to the group (this adds these permissions to all users in the group now or in the future)
     * Is required _id or key in groups field
     * @async
     * @function
     * @name addPermissionsToGroups
     * @param {Object} params
     * @param {Array<String>} params.groups Any valid string, _id or key groups.
     * @param {Array<String>} params.permissions Any valid string, usually the name of what you want to give access to.
     * @param {Array<String>} params.actions Any valid string, usually the action you want to allow the item to perform on the other items to which it gives access by having the permission.
     * @param {Boolean} [params.ignoreDuplicateErrors] By default it is true if you specify false if any of the permissions to add already exists an error will be returned, in any case the permissions that do not exist will be added.
     * @return {Promise<Boolean>}
     * @example
     * addPermissionsToGroups({
     *     "groups": ["group-key", "group-id"],
     *     "permissions": ['leebrary'],
     *     "actions": ['view'],
     *     "ignoreDuplicateErrors": true
     * });
     * */
    async addPermissionsToGroups({ groups, permissions, actions, ignoreDuplicateErrors }) {
        await this.#waitToIp();
        return this.#fetch.post(this.#getURL('/groups/add-permissions'), {
            groups,
            permissions,
            actions,
            ignoreDuplicateErrors
        });
    }

    /**
     * List all existing groups
     * @async
     * @function
     * @name listGroups
     * @param {Object} params
     * @param {Number} params.page
     * @param {Number} params.pageSize Number of items per page
     * @return {Promise<ListGroupsResponse>}
     * @example
     * listGroups({
     *     "page": 1,
     *     "pageSize": 10
     * });
     * */
    async listGroups({ page, pageSize }) {
        await this.#waitToIp();
        return this.#fetch.post(this.#getURL('/groups/list'), { page, pageSize });
    }

    /**
     * Return group details (items and permissions inside groups)
     * @async
     * @function
     * @name detailGroups
     * @param {Array<String>} params
     * @return {Promise<DetailGroupsResponse>}
     * @example
     * detailGroups(["group-key", "group-id"]);
     * */
    async detailGroups(params) {
        await this.#waitToIp();
        return this.#fetch.post(this.#getURL('/groups/detail'), params);
    }

    /**
     * Deletes the items from the groups (this deletes the items inherited permissions it had when it was in that group)
     * @async
     * @function
     * @name removeItemsToGroups
     * @param {Object} params
     * @param {Array<String>} params.groups
     * @param {Array<String>} params.items
     * @param {Array<String>} params.itemTypes
     * @return {Promise<RemoveItemsToGroupsResponse>}
     * @example
     * removeItemsToGroups({
     *     "groups": ["group-key", "group-id"],
     *     "items": ['pepe'],
     *     "itemTypes": ['user']
     * });
     * */
    async removeItemsToGroups({ groups, items, itemTypes }) {
        await this.#waitToIp();
        return this.#fetch.post(this.#getURL('/groups/remove-items'), { groups, items, itemTypes });
    }

    /**
     * Deletes the permissions from the groups (this deletes the items inherited permissions it had when it was in that group)
     * @async
     * @function
     * @name removePermissionsToGroups
     * @param {Object} params
     * @param {Array<String>} params.groups
     * @param {Array<String>} params.permissions
     * @param {Array<String>} params.actions
     * @return {Promise<RemovePermissionsToGroupsResponse>}
     * @example
     * removePermissionsToGroups({
     *     "groups": ["group-key", "group-id"],
     *     "permissions": ['leebrary'],
     *     "actions": ['view']
     * });
     * */
    async removePermissionsToGroups({ groups, permissions, actions }) {
        await this.#waitToIp();
        return this.#fetch.post(this.#getURL('/groups/remove-permissions'), { groups, permissions, actions });
    }

    /**
     * Delete everything related to the group
     * @async
     * @function
     * @name removeGroups
     * @param {Array<String>} params
     * @return {Promise<RemoveGroupsResponse>}
     * @example
     * removeGroups(["group-key", "group-id"]);
     * */
    async removeGroups(params) {
        await this.#waitToIp();
        return this.#fetch.post(this.#getURL('/groups/remove-groups'), params);
    }

    /** @private */
    #getURL(path) {
        return this.#providerIPPrefix + this.ip + '/' + this.#version + path;
    }

    /** @private */
    #timeout(time) {
        return new Promise((resolve) => {
            setTimeout(resolve, time);
        });
    }

    /** @private */
    async #waitToIp() {
        if (!this.ip) {
            await this.#timeout(20);
            return await this.#waitToIp();
        }
    }

    /** @private */
    async #init() {
        try {
            const providerIps = await this.#fetch.get(this.#apiUrl + '/projects/server');
            const promises = [];
            providerIps.forEach((value) => {
                promises.push(this.#getPingTime(this.#providerIPPrefix + value + '/ping'));
            });
            const times = await Promise.all(promises);
            let bestTime = null;
            let ip = null;
            times.forEach((time, index) => {
                if (!bestTime || time < bestTime) {
                    bestTime = time;
                    ip = providerIps[index];
                }
            });
            this.ip = ip;
        } catch (e) {
            throw new Error('[AwesomePermissions] ' + e.message);
        }
    }

    /** @private */
    async #getPingTime(url) {
        let acc = 0;
        let start = new Date();
        await this.#fetch.get(url);
        acc += new Date() - start;
        start = new Date();
        await this.#fetch.get(url);
        acc += new Date() - start;
        return acc;
    }

    /** @private */
    #request(method) {
        return (url, body) => {
            return fetch(url, {
                method,
                body: JSON.stringify(body),
                headers: {
                    Authorization: `Bearer ${this.#accessKey}`,
                    'Content-Type': 'application/json'
                }
            }).then(async function(response) {
                const isJson = response.headers?.get('content-type')?.includes('application/json');
                const data = isJson ? await response.json() : null;

                if (!response.ok) {
                    let reject = { message: (data && data.message) || response.statusText };
                    if (data) reject = { ...reject, ...data };
                    return Promise.reject(reject);
                }

                return data;
            });
        };
    }
}

module.exports = AwesomePermissions;