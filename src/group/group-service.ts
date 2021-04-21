import omit from 'lodash/omit';

import { IGroupService } from './types/group-service.types';
import { Group, GroupBase, GroupDTO, GroupId } from './types/group-dto';
import { IGroupModel } from './types/group-model.types';
import { groupModel as groupModelInstance } from './group-model';

class GroupService implements IGroupService {
  groupModel: IGroupModel;

  constructor(groupModel: IGroupModel) {
    this.groupModel = groupModel;
  }

  private getGroupFromGroupDTO = (groupDTO: GroupDTO): Group =>
    omit(groupDTO, ['createdAt', 'updatedAt']);

  getAll = async () => {
    const groups = await this.groupModel.getAll();

    return groups.map(this.getGroupFromGroupDTO);
  };

  getOne = async (id: GroupId) => {
    const group = await this.groupModel.getOne(id);

    if (group) {
      return this.getGroupFromGroupDTO(group);
    }
  };

  create = async (groupData: GroupBase) => {
    const newGroup = await this.groupModel.create(groupData);

    if (newGroup) {
      return this.getGroupFromGroupDTO(newGroup);
    }
  };

  update = async (id: GroupId, groupData: GroupBase) => {
    const updatedGroup = await this.groupModel.update(id, groupData);

    if (updatedGroup) {
      return this.getGroupFromGroupDTO(updatedGroup);
    }
  };

  delete = async (id: GroupId) => {
    const deletedGroup = await this.groupModel.delete(id);

    if (deletedGroup) {
      return this.getGroupFromGroupDTO(deletedGroup);
    }
  };
}

const groupService = new GroupService(groupModelInstance);

export { groupService };
