/**
 * Base AI Provider interface ensuring vendor-agnostic architecture.
 * Any external provider (AWS, Google, Hive) must extend this class and implement verifyProfilePhoto.
 */
export class AIProvider {
  constructor(providerName) {
    this.providerName = providerName;
  }

  /**
   * Run verification pipeline on an image buffer.
   * @param {Buffer} buffer - The image binary.
   * @returns {Promise<Object>} Verification results conforming to the schema.
   */
  async verifyProfilePhoto(buffer) {
    throw new Error('Method "verifyProfilePhoto" must be implemented by concrete AI Provider.');
  }
}
