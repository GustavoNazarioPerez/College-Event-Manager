module.exports = (sequelize, DataTypes) => {

    const Schools = sequelize.define("Schools", {
        domain: {
            primaryKey: true,
            type: DataTypes.STRING,
            allowNull: false
        },
        schoolName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return Schools;
};