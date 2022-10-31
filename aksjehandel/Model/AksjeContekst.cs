using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace aksjehandel.Model
{
    public class Aksjer
    {
        public int Id { get; set; }
        public string Symbol { get; set; }
        public string Aksjenavn { get; set; }
        public string Exchange { get; set; }
        public int Pris { get; set; }
        public string Image { get; set; }
    }
    public class Kunder
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int kId { get; set; }
        public string kNavn { get; set; }
        public int tlfNummer { get; set; }
        public string rolle { get; set; }
        public int balance { get; set; }
    }

    public class Bestillinger
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int bId { get; set; }
        public int antall { get; set; }
        virtual public Aksjer Aksjer { get; set; }
        virtual public Kunder Kunder { get; set; }
    }

    public class AksjeContext : DbContext
    {
        public AksjeContext(DbContextOptions<AksjeContext> options) : base(options)
        {
            Database.EnsureCreated();
        }
        public DbSet<Aksjer> Aksjer { get; set; }
        public DbSet<Kunder> Kunder { get; set; }
        public DbSet<Bestillinger> Bestillinger { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseLazyLoadingProxies();
        }

    }
}

