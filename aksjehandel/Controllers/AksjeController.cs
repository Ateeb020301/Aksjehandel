using aksjehandel.Model;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

        public List<Aksje> HentAlle()
        {
            List<Aksje> alleAksjer = _db.Aksjer.ToList();
            return alleAksjer;
        }
    }
}
