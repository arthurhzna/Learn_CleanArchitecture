// └── src/
//     └── com/mycompany/
//         ├── Main.java
//         └── orders/
//             ├── domain/
//             │   ├── Order.java
//             │   └── Orders.java
//             │
//             ├── usecase/
//             │   └── ViewOrdersUseCase.java
//             │
//             ├── infrastructure/
//             │   ├── JdbcOrdersRepository.java
//             │   └── InMemoryOrdersRepository.java
//             │
//             └── web/
//                 └── OrdersController.java

// =======================
// DOMAIN (CORE)
// =======================
package com.mycompany.orders.domain;

public class Order {
    private final String id;
    private final String status;

    public Order(String id, String status) {
        this.id = id;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public String getStatus() {
        return status;
    }

    public boolean isShipped() {
        return "SHIPPED".equalsIgnoreCase(status);
    }
}

// PORT (OUTPUT PORT)
package com.mycompany.orders.domain;

public interface Orders {
    Order findById(String id);
}

// =======================
// USE CASE (APPLICATION)
// =======================
package com.mycompany.orders.usecase;

import com.mycompany.orders.domain.Order;
import com.mycompany.orders.domain.Orders;

// Application Service
public class ViewOrdersUseCase {

    private final Orders orders;

    public ViewOrdersUseCase(Orders orders) {
        this.orders = orders;
    }

    public Order execute(String id) {
        return orders.findById(id);
    }
}

// =======================
// INFRASTRUCTURE (ADAPTERS)
// =======================

// Adapter 1: Database (JDBC)
package com.mycompany.orders.infrastructure;

import com.mycompany.orders.domain.Order;
import com.mycompany.orders.domain.Orders;

public class JdbcOrdersRepository implements Orders {

    @Override
    public Order findById(String id) {
        System.out.println("[DB] Fetching order...");
        return new Order(id, "SHIPPED");
    }
}

// Adapter 2: In-Memory (for testing)
package com.mycompany.orders.infrastructure;

import com.mycompany.orders.domain.Order;
import com.mycompany.orders.domain.Orders;

import java.util.HashMap;
import java.util.Map;

public class InMemoryOrdersRepository implements Orders {

    private final Map<String, Order> db = new HashMap<>();

    public InMemoryOrdersRepository() {
        db.put("1", new Order("1", "PENDING"));
        db.put("2", new Order("2", "SHIPPED"));
    }

    @Override
    public Order findById(String id) {
        System.out.println("[MEMORY] Fetching order...");
        return db.getOrDefault(id, new Order(id, "UNKNOWN"));
    }
}

// =======================
// DRIVER (INPUT ADAPTER)
// =======================
package com.mycompany.orders.web;

import com.mycompany.orders.domain.Order;
import com.mycompany.orders.usecase.ViewOrdersUseCase;

public class OrdersController {

    private final ViewOrdersUseCase useCase;

    public OrdersController(ViewOrdersUseCase useCase) {
        this.useCase = useCase;
    }

    public void getOrder(String id) {
        Order order = useCase.execute(id);

        System.out.println("Order ID: " + order.getId());
        System.out.println("Status: " + order.getStatus());
    }
}

// =======================
// APPLICATION BOOTSTRAP
// =======================
package com.mycompany;

import com.mycompany.orders.infrastructure.InMemoryOrdersRepository;
import com.mycompany.orders.infrastructure.JdbcOrdersRepository;
import com.mycompany.orders.domain.Orders;
import com.mycompany.orders.usecase.ViewOrdersUseCase;
import com.mycompany.orders.web.OrdersController;

public class Main {

    public static void main(String[] args) {

        // 🔁 SWITCH ADAPTER HERE
        // Orders repository = new JdbcOrdersRepository();
        Orders repository = new InMemoryOrdersRepository();

        // Inject dependency
        ViewOrdersUseCase useCase = new ViewOrdersUseCase(repository);

        // Controller (driver)
        OrdersController controller = new OrdersController(useCase);

        // Simulate request
        controller.getOrder("1");
    }
}
