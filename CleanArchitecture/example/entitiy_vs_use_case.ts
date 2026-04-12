/**
 * ENTITY (Core Business Logic)
 * ----------------------------------------
 * Represents a core business concept (Loan).
 *
 * Contains:
 * - Critical Business Data
 * - Critical Business Rules
 *
 * Independent from:
 * - databases
 * - frameworks
 * - user interfaces
 */
class Loan {
  constructor(
    private balance: number,
    private interestRate: number
  ) {}

  /**
   * Business Rule:
   * Calculates interest based on balance and interest rate
   */
  calculateInterest(): number {
    return this.balance * this.interestRate;
  }
}


/**
 * USE CASE (Application Business Logic)
 * ----------------------------------------
 * Defines the application flow and user interaction.
 *
 * Responsibilities:
 * - Validate input
 * - Control when Entities are used
 * - Orchestrate business processes
 *
 * Independent from:
 * - UI (web/mobile)
 * - database
 */
class CreateLoanUseCase {
  /**
   * Input DTO (data coming from outer layers, e.g., controller)
   */
  execute(input: {
    contactValid: boolean;
    creditScore: number;
    balance: number;
    interestRate: number;
  }) {
    // Application rule: validate contact information
    if (!input.contactValid) {
      throw new Error("Contact not valid");
    }

    // Application rule: enforce credit score requirement
    if (input.creditScore < 500) {
      throw new Error("Credit score too low");
    }

    // Use Entity (core business logic)
    const loan = new Loan(input.balance, input.interestRate);

    // Output DTO
    return {
      interest: loan.calculateInterest(),
    };
  }
}
