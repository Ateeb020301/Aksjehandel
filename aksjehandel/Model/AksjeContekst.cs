using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace aksjehandel.Model
{
    public class AksjeContext : DbContext
    {
        public bool test = true;
        public AksjeContext(DbContextOptions<AksjeContext> options) : base(options)
        {
                Database.EnsureCreated();
        }
        public DbSet<Aksje> Aksjer { get; set; }
    }
}
