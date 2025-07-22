const { Process } = require('../models');

class ProcessService {
  
  static async createProcess(data) {
    if (!data.name) {
      throw new Error('Process name is required.');
    }

    return await Process.create(data);
  }

  static async getAllProcesses(filters = {}) {
    const whereClause = {};

    // Optional filter by name
    if (filters.name) {
      whereClause.name = {
        [Op.iLike]: `%${filters.name}%`,  // PostgreSQL; change to Op.like if MySQL
      };
    }

    return await Process.findAll({ where: whereClause });
  }

  static async getProcessById(id) {
    const process = await Process.findByPk(id);

    if (!process) {
      throw new Error('Process not found.');
    }

    return process;
  }

  static async updateProcess(id, data) {
    const process = await Process.findByPk(id);

    if (!process) {
      throw new Error('Process not found.');
    }

    await process.update(data);
    return process;
  }

  static async deleteProcess(id) {
    const process = await Process.findByPk(id);

    if (!process) {
      throw new Error('Process not found.');
    }

    await process.destroy();
    return { message: 'Process deleted successfully.' };
  }
}

module.exports = ProcessService;
