import { Service } from 'typedi';
import Knex from 'knex';
import { Group, Permission } from '../models/group';
import Database from '../db.loader';

@Service()
class GroupsRepository {    
    private _db: Knex;
    constructor(database: Database) {
        this._db = database.instance;
    }

    async getAll(): Promise<Group[]> {
        const groups =
            await this._db<Group>('groups')
                .leftJoin('group_permissions', 'groups.group_id', 'group_permissions.group_id')
                .leftJoin('permissions', 'group_permissions.permission_id', 'permissions.permission_id')
                .orderBy('groups.group_id')
                .select({ id: 'groups.group_id' }, { name: 'groups.group_name' }, { permission: 'permissions.permission_name' });

        const finalGroups: Group[] = [];
        let finalIndex = -1;
        let currentId = -1;
        let currentIndex = 0;
        while (currentIndex < groups.length) {
            const nextGroup = groups[currentIndex];

            if (nextGroup.id !== currentId) {
                finalGroups.push({ id: nextGroup.id, name: nextGroup.name, permissions: [nextGroup.permission] });
                finalIndex++;
                currentId = nextGroup.id;
            }
            else {
                finalGroups[finalIndex].permissions.push(nextGroup.permission)
            }
            currentIndex++;
        }
        return finalGroups;
    }

    async getById(id: number): Promise<Group | undefined> {
        const groupPermissions =
            await this._db<Group>('groups')
                .leftJoin('group_permissions', 'groups.group_id', 'group_permissions.group_id')
                .leftJoin('permissions', 'group_permissions.permission_id', 'permissions.permission_id')
                .where('groups.group_id', id)
                .select({ id: 'groups.group_id' }, { name: 'groups.group_name' }, { permission: 'permissions.permission_name' });

        const group: Group = {
            id: groupPermissions[0].id,
            name: groupPermissions[0].name,
            permissions: groupPermissions.map(gp => gp.permission)
        };
        return group;
    }

    async create(group: Omit<Group, 'id'>): Promise<void> {
        await this._db.transaction(async (trx) => {
            const groupId = await trx('groups').insert({ group_name: group.name }, 'group_id');
            const permissionIds = await trx<Permission>('permissions').whereIn('permission_name', group.permissions).select('permission_id');
            permissionIds.forEach(p => p.group_id = groupId[0]);
            await trx('group_permissions').insert(permissionIds);
        });
    }

    async update(id: number, group: Omit<Group, 'id'>): Promise<void> {
        await this._db.transaction(async (trx) => {
            await trx('groups').where('group_id', id).update('group_name', group.name);
            await trx('group_permissions').where('group_id', id).del();
            const permissionIds = await trx<Permission>('permissions').whereIn('permission_name', group.permissions).select('permission_id');
            permissionIds.forEach(p => p.group_id = id);
            await trx('group_permissions').insert(permissionIds);
        });
    }

    async delete(id: number): Promise<void> {
        await this._db<Group>('groups').where('group_id', id).del();
    }
}

export default GroupsRepository;