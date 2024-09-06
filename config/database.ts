import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize('hohoturn_db', 'root', 'fosGAhDd12DSA', {
  host: 'localhost',
  dialect: 'mysql',
})
