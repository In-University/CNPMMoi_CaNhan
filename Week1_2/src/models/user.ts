import { Model, DataTypes, Sequelize } from 'sequelize';

export class User extends Model {
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare address?: string;
  declare phoneNumber?: string;
  declare gender?: string;
  declare roleid?: string;

  static associate(models: any) {
    // define association here
  }
}

export const initUserModel = (sequelize: Sequelize): typeof User => {
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      address: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      gender: DataTypes.STRING,
      roleid: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
