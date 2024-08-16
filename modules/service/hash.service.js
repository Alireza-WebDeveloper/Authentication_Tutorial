const crypto = require('crypto');
const bcrypt = require('bcrypt');
class HashService {
  /**
   * Generates a random code and its hashed value.
   * @param {number} byteLength - The length of the random code in bytes.
   * @returns {Object} An object containing randomCode and hashedCode.
   */
  generateRandomCode = async (byteLength) => {
    const randomCode = crypto.randomBytes(byteLength).toString('hex');
    const hashedCode = crypto
      .createHash('sha256')
      .update(randomCode)
      .digest('hex');

    return { randomCode, hashedCode };
  };
  compareRandomCode = async (plainCode, hashedDbCode) => {
    const hashedPlainCode = crypto
      .createHash('sha256')
      .update(plainCode)
      .digest('hex');
    return hashedPlainCode === hashedDbCode;
  };
  compareHashPassword = async (plainPassword, hashedPassword) => {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error(error.message);
    }
  };
  createHashPassword = async (plainPassword) => {
    try {
      const hash = await bcrypt.hash(plainPassword, 13);
      return hash;
    } catch (err) {
      throw new Error(err);
    }
  };
}

module.exports = new HashService();
