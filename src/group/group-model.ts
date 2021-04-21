import dataBase from '../../db/models';
import { IDataBase } from '../common/types/db-types';

import { GroupBase, GroupId } from './types/group-dto';
import { IGroupModel } from './types/group-model.types';

// Dirty hack to make JS work with TS and preserve typings
const db = (dataBase as unknown) as IDataBase;

class GroupModel implements IGroupModel {
  private db;

  constructor(dbInstance: IDataBase) {
    this.db = dbInstance;
  }

  getAll = async () => {
    const groups = await this.db.Group.findAll();

    return groups.map((group) => group.get());
  };

  getOne = async (id: GroupId) => {
    const group = await this.db.Group.findOne({ where: { id } });

    return group?.get();
  };

  create = async (groupData: GroupBase) => {
    const newGroup = await this.db.Group.create(groupData);

    return newGroup.get();
  };

  update = async (id: GroupId, groupData: GroupBase) => {
    const [, affectedGroups] = await this.db.Group.update(groupData, {
      where: { id },
      returning: true,
    });
    const [updatedGroup] = affectedGroups;

    return updatedGroup?.get();
  };

  delete = async (id: GroupId) => {
    const group = await this.db.Group.findOne({ where: { id } });

    await group?.destroy();

    return group?.get();
  };
}

const groupModel = new GroupModel(db);

export { groupModel };
