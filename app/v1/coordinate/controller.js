const prisma = require('../../../database');
const Schema = require('./validator');
const { policyFor } = require('../../../policy');
const AuthenticationError = require('../../../exceptions/AuthenticationError');
const AuthorizationError = require('../../../exceptions/AuthorizationError');
const InvariantError = require('../../../exceptions/InvariantError');
const { subject } = require('@casl/ability');

const createCoordinate = async (req, res) => {
  try {
    if (!req.user) {
      throw new AuthenticationError('Anda belum melakukan login');
    }

    let policy = policyFor(req.user);

    if (!policy.can('create', 'Coordinate')) {
      throw new AuthorizationError(
        'Anda tidak memiliki akses untuk membuat titik'
      );
    }

    // memastikan user ada
    const isUser = await prisma.user.findFirst({
      where: {
        id: req.user.id,
      },
    });

    if (!isUser) {
      throw new AuthenticationError('Autentikasi anda tidak ditemukan');
    }

    const validationResult = Schema.validate(req.body);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    const coordinate = await prisma.coordinate.create({
      data: {
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        coordinat_owner: req.user.id,
      },
    });

    return res.json({
      status: 'success',
      data: {
        coordinate,
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

const getCoordinatePointByUserId = async (req, res, next) => {
  try {
    const user = { id: req.params.id };

    if (!req.user) {
      throw new AuthenticationError('Anda belum melakukan login');
    }

    let policy = policyFor(req.user);

    if (!policy.can('read', subject('Coordinate', user))) {
      throw new AuthorizationError(
        'Anda tidak memiliki akses untuk mendapatkan titik berdasarkan user'
      );
    }

    const coordinates = await prisma.coordinate.findMany({
      where: {
        coordinat_owner: req.params.id,
      },
    });

    return res.status(200).json({
      status: 'success',
      data: {
        coordinates,
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

module.exports = {
  createCoordinate,
  getCoordinatePointByUserId,
};
