/*
Client (Postman / Frontend)
        ↓
Controller (Express)
        ↓
UseCase (Business Logic)
        ↓
PaymentServiceImpl (Adapter)
        ↓
External API (Payment Gateway)
*/


import express, { Request, Response } from "express";
import fetch from "node-fetch";

/**
 * =========================
 * DOMAIN LAYER
 * =========================
 */

// DTO (Request)
class PaymentDTO {
  constructor(
    public amount: number,
    public userId: string
  ) {}
}

// DTO (Response)
interface PaymentResult {
  status: "success" | "failed";
  chargedAmount: number;
}

// Service Interface (PORT)
interface PaymentService {
  charge(dto: PaymentDTO): Promise<PaymentResult>;
}

/**
 * =========================
 * APPLICATION LAYER / Business logic
 * =========================
 */

class ProcessPaymentUseCase {
  constructor(private paymentService: PaymentService) {}

  async execute(dto: PaymentDTO): Promise<PaymentResult> {
    console.log("UseCase: processing payment...");

    // business rule
    if (dto.amount <= 0) {
      throw new Error("Invalid amount");
    }

    return this.paymentService.charge(dto);
  }
}

/**
 * =========================
 * INFRASTRUCTURE LAYER / Adapter
 * =========================
 */

class PaymentServiceImpl implements PaymentService {
  async charge(dto: PaymentDTO): Promise<PaymentResult> {
    console.log("Infrastructure: calling external payment API...");

    try {
      const response = await fetch("https://example.com/api/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: dto.amount,
          user_id: dto.userId,
        }),
      });

      // OPTIONAL: check response
      if (!response.ok) {
        throw new Error("External service error");
      }

      // dummy mapping (karena endpoint fake)
      return {
        status: "success",
        chargedAmount: dto.amount,
      };

    } catch (error) {
      return {
        status: "failed",
        chargedAmount: 0,
      };
    }
  }
}

/**
 * =========================
 * INTERFACE LAYER (CONTROLLER)
 * =========================
 */

class PaymentController {
  constructor(private useCase: ProcessPaymentUseCase) {}

  handle = async (req: Request, res: Response) => {
    try {
      console.log("Controller: received request");

      // basic validation (interface layer)
      const { amount, user_id } = req.body;

      if (typeof amount !== "number" || typeof user_id !== "string") {
        return res.status(400).json({
          error: "Invalid request payload",
        });
      }

      const dto = new PaymentDTO(amount, user_id);

      const result = await this.useCase.execute(dto);

      return res.json({
        message: "Payment processed",
        data: result,
      });

    } catch (err: unknown) {
      return res.status(400).json({
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  };
}

/**
 * =========================
 * APP (COMPOSITION ROOT)
 * =========================
 */

const app = express();
app.use(express.json());

// Dependency Injection
const paymentService: PaymentService = new PaymentServiceImpl();
const paymentUseCase = new ProcessPaymentUseCase(paymentService);
const paymentController = new PaymentController(paymentUseCase);

// Route
app.post("/payment", paymentController.handle);

// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
