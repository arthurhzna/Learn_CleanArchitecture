// App.tsx

// ========================================
// DOMAIN LAYER (Enterprise Business Rules)
// ========================================

// 👉 ENTITY
class User {
  constructor(
    public name: string,
    public balance: number
  ) {}

  // Optional: business rule inside entity
  isInDebt(): boolean {
    return this.balance < 0;
  }
}

// ========================================
// APPLICATION LAYER (Use Cases)
// ========================================

// abstraction (dependency inversion)
interface UserRepository {
  getUser(): User;
}

// 👉 USE CASE
class GetUserBalance {
  constructor(private userRepository: UserRepository) {}

  execute(): User {
    return this.userRepository.getUser();
  }
}

// ========================================
// INTERFACE ADAPTERS
// ========================================

// 👉 VIEW MODEL (what UI needs)
interface UserBalanceViewModel {
  name: string;
  balance: string;
  isNegative: boolean;
}

// 👉 PRESENTER (format data for UI)
class UserBalancePresenter {
  present(user: User): UserBalanceViewModel {
    return {
      name: user.name,

      // formatting belongs HERE, not in UI
      balance: `Rp ${user.balance.toLocaleString("id-ID")}`,

      // using entity logic
      isNegative: user.isInDebt(),
    };
  }
}

// 👉 CONTROLLER (input boundary)
class UserController {
  constructor(
    private useCase: GetUserBalance,
    private presenter: UserBalancePresenter
  ) {}

  handle(): UserBalanceViewModel {
    const user = this.useCase.execute();
    return this.presenter.present(user);
  }
}

// ========================================
// FRAMEWORK / INFRASTRUCTURE
// ========================================

// 👉 REPOSITORY IMPLEMENTATION
class UserRepositoryImpl implements UserRepository {
  getUser(): User {
    // could be API / DB later
    return new User("Arthur", -15000);
  }
}

// ========================================
// FRAMEWORK (React)
// ========================================

type Props = {
  viewModel: UserBalanceViewModel;
};

// 👉 VIEW (Dumb component)
// NO business logic here
function UserBalanceView({ viewModel }: Props) {
  return (
    <div>
      <h2>{viewModel.name}</h2>

      {/* only rendering, no logic */}
      <p style={{ color: viewModel.isNegative ? "red" : "black" }}>
        {viewModel.balance}
      </p>
    </div>
  );
}

// ========================================
// COMPOSITION ROOT (Dependency Wiring)
// ========================================

export default function App() {
  // manual dependency injection

  const repository = new UserRepositoryImpl();
  const useCase = new GetUserBalance(repository);
  const presenter = new UserBalancePresenter();
  const controller = new UserController(useCase, presenter);

  // UI only consumes ViewModel
  const viewModel = controller.handle();

  return (
    <div>
      <h1>User Balance</h1>
      <UserBalanceView viewModel={viewModel} />
    </div>
  );
}

/*
========================================
WHERE IS THE ENTITY?
========================================

👉 This is the Entity:

class User {
  name: string
  balance: number

  isInDebt()
}

It lives in the DOMAIN layer.

========================================
WHY ENTITY IS IMPORTANT?
========================================

- Holds core business data
- Can contain business rules (e.g., isInDebt)
- Independent from UI, DB, frameworks

========================================
KEY RULE (Clean Architecture)
========================================

Dependency Direction:

React → Controller → UseCase → Entity

Entity NEVER depends on anything else.

========================================
SUMMARY
========================================

✅ Entity = core business object
✅ UseCase = application logic
✅ Presenter = UI formatting
✅ Controller = orchestration
✅ View = rendering only

*/
