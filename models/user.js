
module.exports = (sequelize, Sequelize) => {
    const ActiveAccount = require('../utils/authSendToken');
    const User = sequelize.define('user', {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            allowEmpty: false,
            len: [6, 255]
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            allowEmpty: false,
            len: [6, 255]
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            allowEmpty: false,
            len: [6, 1024]
        },
        status: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            allowEmpty: false,
            defaultValue: false,
        },
        admin: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            allowEmpty: false,
            defaultValue: false,
        }

    });

    User.beforeUpdate((user, options) => {
        if (user.changed('email')) {
            ActiveAccount({id: user.id, email: user.email, username: user.username});
            user.status = false;
        }
    });

    return User;
};
