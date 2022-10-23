using aksjehandel.Model;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Linq.Expressions;
using System.Net.Http;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace aksjehandel.Controllers
{
    [Route("[controller]/[action]")]
    public class AksjeController : ControllerBase
    {
        private readonly AksjeContext _db;
        public AksjeController(AksjeContext db)
        {
            _db = db;
        }


        public bool Lagre(Aksje aksjeInn) {          
            return true;
        }

        public List<Aksje> HentAlle()
        {
            List<Aksje> alleAksjer = _db.Aksjer.ToList();
            return alleAksjer;
        }
    }
}
