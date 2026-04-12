// ===================== ❌ BAD EXAMPLE =====================
// Problem: Business logic depends on HTTP and database

class LoanService_Bad {
  async createLoan(req: any) {
    // ❌ depends on HTTP, req from object HTTP layer
    if (!req.user) throw new Error("Unauthorized");

    const amount = req.body.amount;

    // ❌ depends directly on DB (simulated)
    const loan = await fakePrismaCreate({
      userId: req.user.id,
      amount,
    });

    return loan;
  }
}

// Fake DB function (simulating Prisma)
async function fakePrismaCreate(data: any) {
  return { id: 1, ...data };
}

// =========================================================


// ===================== ✅ GOOD EXAMPLE =====================
// Clean Architecture: Use Case is independent

// Repository Interface
interface LoanRepository {
  save(data: { userId: string; amount: number }): any;
}

// Use Case (Pure Business Logic)
class CreateLoanUseCase {
  constructor(private loanRepo: LoanRepository) {}

  execute(input: { userId: string; amount: number }) {
    if (input.amount <= 0) {
      throw new Error("Invalid amount");
    }

    return this.loanRepo.save(input);
  }
}

// Infrastructure (DB Implementation)
class MySQLLoanRepository implements LoanRepository {
  save(data: { userId: string; amount: number }) {
    // Simulate DB
    return { id: 1, ...data };
  }
}

// Controller (Web Layer)
class LoanController {
  constructor(private usecase: CreateLoanUseCase) {}

  handle(req: any, res: any) {
    const result = this.usecase.execute({
      userId: req.user.id,
      amount: req.body.amount,
    });

    res.json(result);
  }
}

// =========================================================


// ===================== 💡 USAGE =====================

// Wiring (Dependency Injection)
const repo = new MySQLLoanRepository();
const usecase = new CreateLoanUseCase(repo);
const controller = new LoanController(usecase);

// Simulate request
const fakeReq = {
  user: { id: "user-1" },
  body: { amount: 1000 },
};

const fakeRes = {
  json: (data: any) => console.log("Response:", data),
};

controller.handle(fakeReq, fakeRes);

// =========================================================


// ===================== 🎯 KEY TAKEAWAY =====================

// BAD:
// - Service depends on HTTP (req)
// - Service depends on database
// - Hard to test & reuse

// GOOD:
// - Use case is pure business logic
// - No dependency on framework or DB
// - Easy to swap DB / delivery (web, CLI, etc)

// =========================================================
