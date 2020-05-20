const connection = require('../database/connection');
const bcrypt     = require('bcryptjs');
const Yup        = require('yup');

module.exports = {
  // LIST FUNCTION
  async index(request, response) {
    const users = await connection('users')
      .select('user_name AS name')
      .select('user_email AS email')
      .select('user_username AS username');

    return response.json({
      status: 'success',
      message: 'Users.',
      list: users
    });
  },

  // CRIATION FUNCTION
  async store(request, response) {
    const schema = Yup.object().shape({
      user_name: Yup.string().required(),
      user_email: Yup.string().email().required(),
      user_password: Yup.string().required().min(6),
      user_username: Yup.string().required(),
    });

    const { user_name, user_email, user_password, user_username } = request.body;

    const user_pass = await bcrypt.hash(user_password, 8);

    const userEmailExists = await connection('users')
      .where('user_email',request.body.user_email)
      .select('user_email')
      .first();

    const userUsernameExists = await connection('users')
      .where('user_username',request.body.user_username)
      .select('user_email')
      .first();

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ status: 'error', message: 'All fields are required.' });
    }else if (userEmailExists) {
      return response.status(400).json({ status: 'error', message: 'User email already exists.' });
    } else if (userUsernameExists) {
      return response.status(400).json({ status: 'error', message: 'User username already exists.' });
    } else if (user_password.length<6) {
      return response.status(400).json({ status: 'error', message: 'Password must be greater than 6 characters.' });
    } else {
      await connection('users').insert({
        user_name,
        user_email,
        user_status: 1,
        user_password: user_pass,
        user_username
      });

      return response.json({ status: 'success', message: 'User registred.' });
    }

  },

  // UPDDATE FUNCTION
  async update(request, response) {
    const { user_name, user_email, user_password, user_username } = request.body;

    const { id }    = request.params;
    const user_pass = await bcrypt.hash(user_password, 8);

    const idUser = await connection('users')
      .select('user_id')
      .where('user_id',id)
      .first();

    if (user_email!=undefined) {
      const userEmailExists = await connection('users')
        .where('user_email',user_email)
        .select('user_email')
        .first();

        var emailExists = 0;

        (userEmailExists) ? emailExists = 1 : emailExists = 2;
    }

    if (user_username!=undefined) {
      const userUsernameExists = await connection('users')
        .where('user_username',user_username)
        .select('user_email')
        .first();
        var usernameExists = 0;

        (userUsernameExists) ? usernameExists = 1 : usernameExists = 2;
    }

    if (!idUser) {
      return response.status(400).json({ status: 'error', message: 'User id not found' });
    }else if (emailExists==1) {
      return response.status(400).json({ status: 'error', message: 'User email already exists.' });
    } else if (usernameExists==1){
      return response.status(400).json({ status: 'error', message: 'User username already exists.' });
    } else if (request.body.user_password.length<6) {
      return response.status(400).json({ status: 'error', message: 'Password must be greater than 6 characters.' });
    } else {
      await connection('users')
        .where({ 'user_id': id })
        .update({
          user_name,
          user_email,
          user_password: user_pass,
          user_username
        });

      return response.json({ status: 'success', message: 'User has been changed' });
    }

  },

  // DELETE FUNCTION
  async delete(request, response) {
    const { id }    = request.params;

    const user = await connection('users')
      .where('user_id',id)
      .select('user_username AS username')
      .first();

    if (!user) {
      return response.status(400).json({ status: 'error', message: 'User id not found' });
    } else {
      await connection('users')
        .where('user_id',id)
        .update({
           user_status: 0,
           user_username: `${user.username}(soft delete)`
        });

      return response.json({ status: 'success', message: `User ${user.username} was successfully deleted.` });

    }

  }
}