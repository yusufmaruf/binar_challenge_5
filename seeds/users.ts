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
            
            name: "Admin",
            email: "admin@admin",
            password: hashedPasswordAdmin,
            role: "admin",
        },
        {
            
            name: "Super Admin",
            email: "superadmin@admin",
            password: hashedPasswordSuperAdmin,
            role: "superadmin",
        },
    ]);
};
