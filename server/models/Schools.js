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
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        numStudents: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        super_id: {
            // super admin id
            type: DataTypes.INTEGER,
            allownull: false,
        }
    });

    return Schools;
};