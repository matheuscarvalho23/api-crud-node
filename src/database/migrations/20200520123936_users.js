// CRIAÇÃO DAS COLUNAS DA TABELA USERS
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table){
    table.increments('user_id');
    table.integer('user_status').notNullable();
    table.string('user_name').notNullable();
    table.string('user_email').notNullable();
    table.string('user_password').notNullable();
    table.string('user_username').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
