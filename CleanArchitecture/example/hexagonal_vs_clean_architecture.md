[Meisam Alifallhi, Hexagonal vs. Clean architecture](https://medium.com/@araxis/hexagonal-vs-clean-architecture-b11a6833136e)

Clean Architecture
MyProject
├── MyProject.Application              ← 🔥 Orchestration layer (use cases / business flow)
│   ├── Services                      ← ⚠️ OPTIONAL: reusable helpers (NOT entry points)
│   ├── UseCases                      ← ✅ ENTRY POINTS (1 class = 1 feature)
│   └── ViewModels                    ← 📦 Output DTOs (data sent to UI)

├── MyProject.Domain                  ← 🔥 Core business (pure, no dependencies)
│   ├── Entities                      ← 🧠 Business objects (Book, User, Order)
│   ├── Interfaces                    ← 🔌 Contracts (Repository, Gateway)
│   └── Services                      ← 🧠 Business rules (complex logic)

├── MyProject.Infrastructure          ← 🔧 Technical implementations
│   ├── Data                          ← 🗄️ Database setup (DbContext, connection)
│   ├── Repositories                  ← 💾 DB access (CRUD, SQL, EF, Dapper)
│   └── Services                      ← 🌐 External integrations (Email, Payment API)

├── MyProject.Presentation            ← 🎨 UI / API layer (user interaction)
│   ├── Controllers                   ← 🎯 HTTP entry points
│   ├── Models                        ← 📦 Input/Output models
│   └── Views                         ← 🖥️ UI rendering (Razor / HTML)

Hexagonal Architecture
MyProject
├── MyProject.Domain                ← 🧠 CORE (pure business)
│   ├── Entities                   ← Business objects (Book, Order, User)
│   ├── Interfaces                 ← ⚠️ Domain ports (jarang banyak di sini)
│   └── Services                   ← Business rules (domain logic)

├── MyProject.Application          ← 🎯 USE CASE layer (driving logic)
│   ├── Services                   ← Use cases (application services)
│   └── Interfaces                 ← 🔌 PORTS (input & output contracts)

├── MyProject.Adapters             ← 🔧 IMPLEMENTATIONS (adapters)
│   ├── RestApi                    ← 🌐 HTTP controller (driving adapter)
│   ├── Database                   ← 💾 DB implementation (driven adapter)
│   └── Interfaces                 ← ⚠️ optional (shared adapter contracts)
