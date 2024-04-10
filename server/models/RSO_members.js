module.exports = (sequelize, DataTypes) => {
    const RSO_members = sequelize.define("RSO_members", {
        rso_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'RSOs',
                key: 'rso_id'
            },
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'user_id'
            },
            allowNull: false
        }
    });

    return RSO_members;
};