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
        text: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });
    return Comments;
}