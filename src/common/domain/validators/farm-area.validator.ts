export class FarmAreaValidator {
  /**
   * Validates if the sum of arable and vegetation areas is less than or equal to total area.
   */
  static isValidAreas(total: number, arable: number, vegetation: number): boolean {
    return (arable + vegetation) <= total;
  }
}
