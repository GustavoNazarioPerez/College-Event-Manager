module.exports = (sequelize, DataTypes) => {
    const Events = sequelize.define("Events", {
        event_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        event_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        event_desc: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        event_type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.STRING,
            allowNull: false
        },
        time: {
            type: DataTypes.STRING,
            allowNull: false
        },
        contact_phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        contact_email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rso_id: {
            // set to null if university wide event
            type: DataTypes.INTEGER,
            allowNull: true
        },
        domain: {
            type: DataTypes.STRING,
            allowNull: false
        },
        is_public: {
            // set to null if RSO event
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        approved: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    });

    return Events;
}