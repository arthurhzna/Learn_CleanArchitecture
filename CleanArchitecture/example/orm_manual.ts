/*
application/
  usecases/

domain/
  entities/

interface_adapters/
  gateways/

infrastructure/
  database/
    UserGatewayImpl.js   ← SQL + mapping di sini

*/

// domain/entities/User.js
export class User {
  constructor(id, firstName, lastName, lastLogin) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.lastLogin = lastLogin;
  }
}

// interface_adapters/gateways/UserGateway.js
export class UserGateway {
  async getUsersLoggedInAfter(date) {
    throw new Error("Not implemented");
  }
}

// infrastructure/database/UserGatewayImpl.js
import { UserGateway } from "../../interface_adapters/gateways/UserGateway.js";
import { User } from "../../domain/entities/User.js";

function mapRowToUser(row) {
  return new User(
    row.id,
    row.first_name,
    row.last_name,
    row.last_login
  );
}

export class UserGatewayImpl extends UserGateway {
  constructor(db) {
    super();
    this.db = db; // misalnya mysql2 / pg
  }

  async getUsersLoggedInAfter(date) {
    const query = `
      SELECT id, first_name, last_name, last_login
      FROM users
      WHERE last_login > ?
    `;

    const [rows] = await this.db.execute(query, [date]);

    // 🔥 DATA MAPPER (manual)
    return rows.map(mapRowToUser);
  }
}

// application/usecases/GetRecentUserLastNames.js
export class GetRecentUserLastNames {
  constructor(userGateway) {
    this.userGateway = userGateway;
  }

  async execute(date) {
    const users = await this.userGateway.getUsersLoggedInAfter(date);
    return users.map(user => user.lastName);
  }
}

///TESTING!!!!!!!!!!!!!!!!!!!!
const fakeGateway = {
  getUsersLoggedInAfter: async () => [
    { lastName: "Arthur" },
    { lastName: "Budi" }
  ]
};

const useCase = new GetRecentUserLastNames(fakeGateway);

useCase.execute(new Date()).then(console.log);
