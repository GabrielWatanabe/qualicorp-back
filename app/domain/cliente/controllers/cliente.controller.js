const db = require("../models");
const Cliente = db.cliente;

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;
    
    return { limit, offset };
};

exports.findAll = (req, res) => {
    const { nome, size, page } = req.query;
    var condition = nome ? { nome: { $regex: new RegExp(nome), $options: "i" } } : {};
  
    const { offset } = getPagination(page, size);

    Cliente.paginate(condition, { offset })
      .then(data => {
        res.send({
            totalItems: data.totalDocs,
            clientes: data.docs,
            totalPages: data.totalPages,
            currentPage: data.page - 1,
        });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving client."
        });
      });
};
// Create and Save a new Tutorial
exports.create = (req, res) => {
    if (!req.body.nome) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
      }
    
      // Create a Tutorial
      const cliente = new Cliente({
        nome: req.body.nome,
        cpf: req.body.cpf,
        email: req.body.email,
        telefone: req.body.telefone,
        endereco: req.body.endereco,
        dataNascimento: req.body.dataNascimento,
      });
    
      // Save Tutorial in the database
      cliente
        .save(cliente)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Client."
          });
        });
};

// Retrieve all Tutorials from the database.

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Cliente.findById(id)
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Client with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Client with id=" + id });
      });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
          message: "Data to update can not be empty!"
        });
      }
    
      const id = req.params.id;
    
      Cliente.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
          if (!data) {
            res.status(404).send({
              message: `Cannot update Clientt with id=${id}. Maybe Client was not found!`
            });
          } else res.send({ message: "Client was updated successfully." });
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating Tutorial with id=" + id
          });
        });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Cliente.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Client with id=${id}. Maybe Client was not found!`
          });
        } else {
          res.send({
            message: "Client was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Client with id=" + id
        });
      });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
    Cliente.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Client were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all clients."
      });
    });
};
