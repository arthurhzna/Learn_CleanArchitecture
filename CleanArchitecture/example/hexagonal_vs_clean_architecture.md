# 📚 Clean Architecture vs Hexagonal Architecture

🔗 Reference:  
[Meisam Alifallhi, Hexagonal vs. Clean architecture](https://medium.com/@araxis/hexagonal-vs-clean-architecture-b11a6833136e)

---

# 🧱 Clean Architecture

```
MyProject
├── MyProject.Application              # 🔥 Orchestration layer (use cases / business flow)
│   ├── Services                      # ⚠️ OPTIONAL: reusable helpers (NOT entry points)
│   ├── UseCases                      # ✅ ENTRY POINTS (1 class = 1 feature)
│   └── ViewModels                    # 📦 Output DTOs (data sent to UI)

├── MyProject.Domain                  # 🔥 Core business (pure, no dependencies)
│   ├── Entities                      # 🧠 Business objects (Book, User, Order)
│   ├── Interfaces                    # 🔌 Contracts (Repository, Gateway)
│   └── Services                      # 🧠 Business rules (complex logic)

├── MyProject.Infrastructure          # 🔧 Technical implementations
│   ├── Data                          # 🗄️ Database setup (DbContext, connection)
│   ├── Repositories                  # 💾 DB access (CRUD, SQL, EF, Dapper)
│   └── Services                      # 🌐 External integrations (Email, Payment API)

├── MyProject.Presentation            # 🎨 UI / API layer (user interaction)
│   ├── Controllers                   # 🎯 HTTP entry points
│   ├── Models                        # 📦 Input/Output models (DTO)
│   └── Views                         # 🖥️ UI rendering (Razor / HTML)
```

---

## 🧠 Key Idea

- Layer-based architecture
- Dependency flows **inward**
- Clear separation:
  - Domain → Business logic
  - Application → Use cases
  - Infrastructure → Implementation
  - Presentation → UI/API

---

# 🔷 Hexagonal Architecture (Ports & Adapters)

```
MyProject
├── MyProject.Domain                  # 🧠 CORE (pure business)
│   ├── Entities                      # Business objects (Book, Order, User)
│   ├── Interfaces                    # ⚠️ Rare (domain-level abstractions)
│   └── Services                      # Business rules

├── MyProject.Application             # 🎯 USE CASE layer (center / hexagon)
│   ├── Services                      # Use cases (application services)
│   └── Interfaces                    # 🔌 PORTS (input & output contracts)

├── MyProject.Adapters                # 🔧 IMPLEMENTATIONS (adapters)
│   ├── RestApi                       # 🌐 Driving adapter (HTTP controllers)
│   ├── Database                      # 💾 Driven adapter (DB implementation)
│   └── ExternalApi                   # 🌐 External services (Payment, Email)
```

---

## 🧠 Key Idea

- Port-based architecture
- Communication via **interfaces (ports)**
- Adapters implement those ports

---

# 🔄 Concept Mapping

| Clean Architecture       | Hexagonal Architecture        |
|--------------------------|------------------------------|
| UseCase                  | Application Service          |
| Interface (Repository)   | Output Port                  |
| Controller              | Driving Adapter              |
| Infrastructure           | Driven Adapter               |
| Layers                  | Ports & Adapters             |

---

# 🔥 Flow Comparison

## Clean Architecture

```
Controller
↓
UseCase
↓
Repository Interface
↓
Repository Implementation
↓
Database
```

---

## Hexagonal Architecture

```
Controller (Adapter)
↓
Input Port
↓
UseCase (Application Service)
↓
Output Port
↓
Adapter (Repository / API)
↓
External System
```

---

# 🧠 Summary

- **Clean Architecture** → focuses on **layers**
- **Hexagonal Architecture** → focuses on **ports (interfaces)**
- Both:
  - Enforce dependency inversion
  - Keep business logic independent
  - Separate concerns

---

# 💡 One-Liner

> Clean Architecture = **Structure (layers)**  
> Hexagonal Architecture = **Communication (ports & adapters)**
