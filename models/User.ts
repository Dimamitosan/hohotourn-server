import { DataTypes, Model, Optional } from 'sequelize'
import { sequelize } from '../config/database'

interface UserAttributes {
  id: number
  nick: string
  coins?: number
  roomCode?: string
  token?: string
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number
  public nick!: string
  public coins!: number
  public roomCode!: string
  public token!: string
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nick: {
      type: new DataTypes.STRING(45),
      allowNull: false,
    },
    coins: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    roomCode: {
      type: new DataTypes.STRING(10),
      allowNull: true,
    },
    token: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
  },
  {
    tableName: 'user',
    sequelize,
    timestamps: false,
  }
)

export default User
