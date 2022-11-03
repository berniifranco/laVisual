module.exports = (sequelize, dataTypes) => {
    let alias = 'Producto';

    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: dataTypes.STRING
        },
        precio: {
            type: dataTypes.STRING
        },
        cantidad: {
            type: dataTypes.INTEGER
        }
    };

    let config = {
        tableName: 'producto',
        timestamps: false
    };

    const Producto = sequelize.define(alias, cols, config);

    return Producto;
}