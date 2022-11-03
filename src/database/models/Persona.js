module.exports = (sequelize, dataTypes) => {
    let alias = 'Persona';

    let cols = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: dataTypes.STRING
        },
        usuario: {
            type: dataTypes.STRING
        },
        email: {
            type: dataTypes.STRING
        },
        contrasena: {
            type: dataTypes.STRING
        },
        direccion: {
            type: dataTypes.STRING
        },
        ciudad: {
            type: dataTypes.STRING
        },
        provincia: {
            type: dataTypes.STRING
        },
        pais: {
            type: dataTypes.STRING
        }
    };

    let config = {
        tableName: 'persona',
        timestamps: false
    };

    const Persona = sequelize.define(alias, cols, config);

    return Persona;
}