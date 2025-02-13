﻿using Microsoft.AspNetCore.Identity;

namespace TextingBackendApi.Data.Seeders
{
    public class RoleSeeder
    {
        public static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
        {
            string[] roles = new[] { "Admin", "Sender", "Viewer" };
            foreach (var role in roles)
            {
                 if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }
    }
}
