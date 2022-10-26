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

        public async Task<bool> Lagre(Aksjer aksjeInn) {
            try {
                if (await _db.Aksjer.FindAsync(aksjeInn.Id) != null)
                {
                    _db.Aksjer.Remove(aksjeInn);
                    await _db.SaveChangesAsync();
                }
                Aksjer nyAksje = new Aksjer
                {
                    Id = aksjeInn.Id,
                    Symbol = aksjeInn.Symbol,
                    Aksjenavn = aksjeInn.Aksjenavn,
                    Exchange = aksjeInn.Exchange,
                    Pris = aksjeInn.Pris,
                    Image = aksjeInn.Image,
                };
                _db.Aksjer.Add(nyAksje);
                await _db.SaveChangesAsync();
                return true;
            }
            catch {
                return false;
            }
        }

        public async Task<bool> LagreKunde(Kunder kundeInn)
        {
            try
            {
                Kunder nyKunde = new Kunder
                {
                    kNavn = kundeInn.kNavn,
                    tlfNummer = kundeInn.tlfNummer,
                    rolle = kundeInn.rolle,
                    balance = kundeInn.balance
                };
                _db.Kunder.Add(nyKunde);
                await _db.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> LagreBestilling(Bestillinger bestillingInn)
        {
            try
            {
                _db.Bestillinger.Add(bestillingInn);
                await _db.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<List<Aksjer>> HentAlle()
        {
            List<Aksjer> alleAksjer = await _db.Aksjer.ToListAsync();
            return alleAksjer;
        }

        public async Task<List<Kunder>> HentKunder()
        {
            List<Kunder> alleKunder = await _db.Kunder.ToListAsync();
            return alleKunder;
        }

        public async Task<Aksjer> HentAksje(int id)
        {
            try
            {
                Aksjer enAksje = await _db.Aksjer.FindAsync(id);
                return enAksje;
            } catch
            {
                return null;
            }
        }

        public async Task<Kunder> HentKunde(int id)
        {
            try
            {
                Kunder enKunde = await _db.Kunder.FindAsync(id);
                return enKunde;
            }
            catch
            {
                return null;
            }
        }

        public async Task<Kunder> EndreKunde(Kunder kundeInn)
        {
            try
            {
                Kunder funnetKunde = await _db.Kunder.FindAsync(kundeInn.kId);
                funnetKunde.kNavn = kundeInn.kNavn;
                funnetKunde.rolle = kundeInn.rolle;
                funnetKunde.tlfNummer = kundeInn.tlfNummer;
                funnetKunde.balance = kundeInn.balance;
                await _db.SaveChangesAsync();
                return funnetKunde;
            }
            catch
            {
                return null;
            }
        }
    }
}
