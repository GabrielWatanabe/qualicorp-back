module.exports = (mongoose, mongoosePaginate) => {
    var schema = mongoose.Schema(
        {
          nome: String,
          cpf: String,
          email: String,
          telefone: String,
          endereco: String,
          dataNascimento: String,
        },
        { timestamps: true }
    );

    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });
    schema.plugin(mongoosePaginate);
    
    const Cliente = mongoose.model("cliente", schema);
    return Cliente;
};