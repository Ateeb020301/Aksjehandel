using aksjehandel.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        public async Task<bool> Lagre(Aksje aksjeInn) {
            try {
                if (await _db.Aksjer.FindAsync(aksjeInn.Id) != null)
                {
                    _db.Aksjer.Remove(aksjeInn);
                    await _db.SaveChangesAsync();
                }
                _db.Aksjer.Add(aksjeInn);
                await _db.SaveChangesAsync();
                return true;
            }
            catch {
                return false;
            }
        }

        public async Task<List<Aksje>> HentAlle()
        {
            List<Aksje> alleAksjer = await _db.Aksjer.ToListAsync();
            return alleAksjer;
        }

        public async Task<Aksje> HentAksje(int id)
        {
            try
            {
                Aksje enAksje = await _db.Aksjer.FindAsync(id);
                return enAksje;
            } catch
            {
                return null;
            }
        }
    }
}
