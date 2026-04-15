// 📦 Project Structure
// src/
// └── com/mycompany/orders/
//     ├── domain/
//     │   ├── Order.java
//     │   └── Orders.java
//     ├── usecase/
//     │   └── ViewOrdersUseCase.java
//     ├── infrastructure/
//     │   └── JdbcOrdersRepository.java
//     └── OrdersComponent.java

// 🧾 1️⃣ domain/Order.java
    
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

// 🧾 2️⃣ domain/Orders.java (interface)
package com.mycompany.orders.domain;

// Abstraction (PORT)
public interface Orders {
    Order findById(String id);
}

// 🧾 3️⃣ usecase/ViewOrdersUseCase.java
package com.mycompany.orders.usecase;

import com.mycompany.orders.domain.Order;
import com.mycompany.orders.domain.Orders;

// Package-private (not public)
class ViewOrdersUseCase {

    private final Orders orders;

    ViewOrdersUseCase(Orders orders) {
        this.orders = orders;
    }

    Order execute(String id) {
        return orders.findById(id);
    }
}

// 🧾 4️⃣ infrastructure/JdbcOrdersRepository.java
package com.mycompany.orders.infrastructure;

import com.mycompany.orders.domain.Order;
import com.mycompany.orders.domain.Orders;

// Package-private → cannot be accessed outside the component
class JdbcOrdersRepository implements Orders {

    @Override
    public Order findById(String id) {
        // Simulate database access
        System.out.println("Fetching order from database...");
        return new Order(id, "SHIPPED");
    }
}

// 🧾 5️⃣ OrdersComponent.java (🔥 ENTRY POINT)
package com.mycompany.orders;

import com.mycompany.orders.domain.Order;
import com.mycompany.orders.domain.Orders;
import com.mycompany.orders.infrastructure.JdbcOrdersRepository;
import com.mycompany.orders.usecase.ViewOrdersUseCase;

// ✅ THE ONLY PUBLIC CLASS (Component Boundary)
public class OrdersComponent {

    private final ViewOrdersUseCase useCase;

    public OrdersComponent() {
        Orders repository = new JdbcOrdersRepository();
        this.useCase = new ViewOrdersUseCase(repository);
    }

    public Order getOrder(String id) {
        return useCase.execute(id);
    }
}

// 🧾 6️⃣ Example Usage (Main.java)
package com.mycompany;

import com.mycompany.orders.OrdersComponent;
import com.mycompany.orders.domain.Order;

public class Main {
    public static void main(String[] args) {

        OrdersComponent orders = new OrdersComponent();

        Order order = orders.getOrder("123");

        System.out.println("Order ID: " + order.getId());
        System.out.println("Status: " + order.getStatus());
    }
}
