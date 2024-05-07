const bcrypt = require('bcrypt');
const { Schema, refreshTokenSchema } = require('./validator');
const prisma = require('../../../database');
const jwt = require('jsonwebtoken');
const config = require('../../../config');
const InvariantError = require('../../../exceptions/InvariantError');

const register = async (req, res) => {
  try {
    const validationResult = Schema.validate(req.body);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    const result = await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    });

    if (result) {
      throw new InvariantError('username ini sudah digunakan');
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: hashedPassword,
      },
    });

    res.json({
      status: 'success',
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
      });
    } else {
      console.log(error);
      return res.status(500).json({
        status: 'fail',
        message: 'error terjadi pada server',
      });
    }
  }
};

const login = async (req, res, next) => {
  try {
    const validationResult = Schema.validate(req.body);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      throw new InvariantError('wrong username or password');
    }

    const compare = await bcrypt.compare(password, user.password);

    if (!compare) {
      throw new InvariantError('wrong username or password');
    }

    const accessToken = jwt.sign({ id: user.id }, config.accessTokenKey, {
      expiresIn: '1h',
    });
    const refreshToken = jwt.sign({ id: user.id }, config.refreshTokenKey, {
      expiresIn: '7d',
    });

    await prisma.authentications.create({
      data: {
        token: refreshToken,
      },
    });

    return res.json({
      status: 'success',
      data: {
        id: user.id,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
      });
    } else {
      return res.status(500).json({
        status: 'fail',
        message: 'error terjadi pada server',
      });
    }
  }
};

const updateAccessToken = async (req, res) => {
  try {
    const refreshToken = req.body.refresh_token;
    const validationResult = refreshTokenSchema.validate(req.body);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    // verifikasi refresh token di database
    const valid = await prisma.authentications.findUnique({
      where: {
        token: refreshToken,
      },
    });

    if (!valid) {
      throw new InvariantError('Refresh token tidak valid');
    }

    const { id } = jwt.verify(refreshToken, config.refreshTokenKey);

    const accessToken = jwt.sign({ id }, config.accessTokenKey, {
      expiresIn: '1h',
    });

    res.json({
      status: 'success',
      message: 'Access Token berhasil diperbarui',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    console.log(error.name);
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
      });
    } else if (error.name === 'TokenExpiredError') {
      await prisma.authentications.delete({
        where: {
          token: req.body.refresh_token,
        },
      });
      return res.status(401).json({
        status: 'fail',
        message: error.message,
      });
    } else {
      return res.status(500).json({
        status: 'fail',
        message: 'error terjadi pada server',
      });
    }
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.body.refresh_token;

    const validationResult = refreshTokenSchema.validate(req.body);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    // verifikasi refresh token di database
    const valid = await prisma.authentications.findUnique({
      where: {
        token: refreshToken,
      },
    });

    if (!valid) {
      throw new InvariantError('Refresh token tidak valid');
    }

    await prisma.authentications.delete({
      where: {
        token: refreshToken,
      },
    });

    return res.json({
      status: 'success',
      message: 'Berhasil logout',
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        status: 'fail',
        message: error.message,
      });
    } else {
      return res.status(500).json({
        status: 'fail',
        message: 'error terjadi pada server',
      });
    }
  }
};

module.exports = {
  register,
  login,
  updateAccessToken,
  logout,
};
