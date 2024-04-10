module.exports = (sequelize, DataTypes) => {

    const RSOs = sequelize.define("RSOs", {
        rso_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        domain: {
            type: DataTypes.STRING,
            allowNull: false
        },
        orgName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return RSOs;
};