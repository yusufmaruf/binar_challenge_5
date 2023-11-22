import { Knex } from "knex";
const tableName = "users";
import bcrypt from "bcrypt";


export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex(tableName).del();
    const hashedPasswordAdmin = await bcrypt.hash("admin", 10);
    const hashedPasswordSuperAdmin = await bcrypt.hash("superadmin", 10);

    // Inserts seed entries
    await knex(tableName).insert([
        {
            id: 1,
            name: "Admin",
            email: "admin@admin",
            password: hashedPasswordAdmin,
            role: "admin",
        },
        {
            id: 2,
            name: "Super Admin",
            email: "superadmin@admin",
            password: hashedPasswordSuperAdmin,
            role: "superadmin",
        },
    ]);
};
