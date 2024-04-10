module.exports = (sequelize, DataTypes) => {
    const Event_members = sequelize.define("Event_members", {
        event_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Events',
                key: 'event_id'
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

    return Event_members;
};