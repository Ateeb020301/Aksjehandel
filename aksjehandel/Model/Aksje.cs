using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace aksjehandel.Model
{
    public class Aksje
    {
        public int Id { get; set; }
        public string symbol { get; set; }
        public string Aksjenavn { get; set; }
        public int Pris { get; set; }
        public int Stock { get; set; }

    }
}
