module.exports = (sequelize, dataTypes) => {
    let alias = 'Empresa';

    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: dataTypes.INTEGER
        }
    };

    let config = {
        tableName: 'empresa',
        timestamps: false
    };

    const Empresa = sequelize.define(alias, cols, config);

    Empresa.associate = function(modelos) {
        Empresa.hasMany(modelos.Persona, {
            as: 'persona',
            foreignKey: 'id_empresa'
        })
    };

    return Empresa;
}