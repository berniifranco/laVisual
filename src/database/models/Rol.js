module.exports = (sequelize, dataTypes) => {
    let alias = 'Rol';
    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: dataTypes.STRING
        }
    };

    let config = {
        tableName: 'rol',
        timestamps: false
    };

    const Rol = sequelize.define(alias, cols, config);

    Rol.associate =  function(modelos) {
        Rol.hasMany(modelos.Persona, {
            as: 'persona',
            foreignKey: 'id_rol'
        })
    }

    return Rol
}