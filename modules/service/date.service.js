class DateService {
  /**
   * Checks if the OTP code is still valid based on the current time and otpExpiry.
   * @param {Date} otpExpiry - The expiry time of the OTP.
   * @param {number} validityDuration - The duration (in seconds) the OTP should be valid for.
   * @returns {boolean} True if the OTP is still valid, false otherwise.
   */
  isOtpValid(otpExpiry) {
    const currentTime = Date.now();
    const expiryTime = new Date(otpExpiry).getTime();

    return expiryTime > currentTime;
  }
  /**
   * Adds a specified number of seconds to the current date and returns the new date.
   * @param {number} seconds - The number of seconds to add to the current date.
   * @returns {Date} The new date with the added seconds.
   */
  addSecondsToDate(seconds) {
    const currentTime = new Date();
    return new Date(currentTime.getTime() + seconds * 1000);
  }
}

module.exports = new DateService();
