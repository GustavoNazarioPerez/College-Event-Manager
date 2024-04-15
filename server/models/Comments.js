module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define("Comments", {
        comment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        event_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    });
    return Comments;
}