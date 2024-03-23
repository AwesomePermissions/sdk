const AwesomePermissions = require('./lib');

(async () => {
    try {
        const awp = new AwesomePermissions({
            developMode: true,
            accessKey: 'rsDB03aJpFyg8wPuIHFbHmMAy_QGaW3qv_QDZB94h3_41zbNp-fvAJulieFjfoMo',// 'rss8mLLhnio3LlSwcgCjIuDsvfhiH435boT1USe0eo4Q7rcmwELOKPtSxTaPrNjl'
        });


        for (let i = 0; i < 100000; i++) {

            console.log("1");
            const r1 = await awp.addPermissionsToItems({
                'items': ['Leonardooooooodoode'+i],
                'itemTypes': ['user'],
                'permissions': ['image.mona-lisa'+i],
                'actions': ['owner'+i]
            });
            console.log('1 - ', r1);
            console.log("2");
            const r2 = await awp.addPermissionsToItems({
                'items': ['Mona Lisa´s'+i],
                'itemTypes': ['image'],
                'permissions': ['image.mona-lisa'+i],
                'actions': ['owner'+i]
            });
            console.log('2 - ', r2);
            console.log("3");
            const r3 = await awp.addPermissionsToItems({
                'items': ['Mona Lisa´s'+i],
                'itemTypes': ['image'],
                'permissions': ['image.mona-lisa'+i],
                'actions': ['view'+i]
            });
            console.log('3 - ', r3);
            console.log("4");
            try {
                const r4 = await awp.addGroups([{
                    'name': 'Users with image view acces'+i,
                    'key': 'users-imagee'+i
                }]);
                console.log('4 - ', r4);
            } catch (e) {}

            console.log("5");
            const r5 = await awp.addItemsToGroups({
                'groups': ['users-imagee'+i],
                'items': ['additional-user-1'+i, 'additional-user-2'+i, 'additional-user-3'+i],
                'itemTypes': ['user']
            });
            console.log('5 - ', r5);
            console.log("6");
            const r6 = await awp.addPermissionsToGroups({
                'groups': ['users-imagee'+i],
                'permissions': ['image.mona-lisa'+i],
                'actions': ['view']
            });
            console.log('6 - ', r6);
            console.log("7");
            // We check that they have access to each other by removing all items that have access to the image.
            const r7 = await awp.getItemsWithPermissionsForItems({
                'items': ['Mona Lisa´s'+i],
                'itemTypes': ['user']
            });
            console.log('7 - ');
            console.log(JSON.stringify(r7, null, ' '));
        }


        /*
        let permissions = [];
        for (let i = 0, l = 1000; i < l; i++) {
            permissions.push('perm' + i);
        }

        const a = await awp.addPermissionsToItems({
            'items': ['user-id'],
            'itemTypes': ['user'],
            'permissions': permissions,
            'actions': ['edit'],
            'ignoreDuplicateErrors': true
        });


        // Solo devuelve true si TODOS los items especificados tienen los permisos con los actions especificados
        const itemsHasPermissions = await awp.itemsHasPermissions({
            'items': ['user-id'],
            'permissions': ['image-id'],
            'actions': ['edit']
        });
        // console.log('itemsHasPermissions', itemsHasPermissions);

        const getItemsWithPermissions = await awp.getItemsWithPermissions({
            'permissions': ['image-id'],
            'actions': ['edit'],
            'mode': '$or',
            'raw': true
        });
        // console.log('getItemsWithPermissions', getItemsWithPermissions);

        const getItemsPermissions = await awp.getItemsPermissions({
            'items': ['user-id'],
            'raw': true
        });

        // console.log('getItemsPermissions', getItemsPermissions);

        const getItemsWithPermissionsForItems = await awp.getItemsWithPermissionsForItems({
            'items': ['user-id'],
            'itemTypes': ['image'],
            'returnPermissionsThatLinkThem': true
        });

        console.log('getItemsWithPermissionsForItems', getItemsWithPermissionsForItems);

        const itemsHasAccessToItems = await awp.itemsHasAccessToItems({
            'items': ['user-id'],
            'itemsToAccess': ['image-id'],
            'returnPermissionsThatLinkThem': true
        });

        // console.log('itemsHasAccessToItems', itemsHasAccessToItems[0]);
        
         */

    } catch (e) {
        console.error(e);
    }
})();