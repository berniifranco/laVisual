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
        },
        id_persona: {
            type: dataTypes.INTEGER
        },
        id_categoria: {
            type: dataTypes.INTEGER
        }
    };

    let config = {
        tableName: 'producto',
        timestamps: false
    };

    const Producto = sequelize.define(alias, cols, config);

    Producto.associate = function(modelos) {
        Producto.belongsTo(modelos.Categoria, {
            as: 'categoria',
            foreignKey: 'id_categoria'
        });
        Producto.belongsTo(modelos.Persona, {
            as: 'persona',
            foreignKey: 'id_persona'
        })
    }

    return Producto;
}