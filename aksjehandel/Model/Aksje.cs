using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace aksjehandel.Model
{
    public class Aksje
    {
        public int Id { get; set; }
        public string Symbol { get; set; }
        public string Aksjenavn { get; set; }
        public string Exchange { get; set; }
        public int Pris { get; set; }
        public string Image { get; set; }
        public int kId { get; set; }
        public string kNavn { get; set; }
        public int tlfNummer { get; set; }
        public string rolle { get; set; }
        public int balance { get; set; }
        public int bId { get; set; }
        public int antall { get; set; }


    }
}
