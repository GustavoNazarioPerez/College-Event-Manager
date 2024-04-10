module.exports = (sequelize, DataTypes) => {

    const Users = sequelize.define("Users", {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        domain: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        roleid: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return Users;
};