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

        public async Task<List<Aksjer>> HentAlle()
        {
            List<Aksjer> alleAksjer = await _db.Aksjer.ToListAsync();
            return alleAksjer;
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

        public async Task<List<Kunder>> HentKunder()
        {
            List<Kunder> alleKunder = await _db.Kunder.ToListAsync();
            return alleKunder;
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

        public async Task<Bestillinger> HentBestilling(int id)
        {
            try
            {
                Bestillinger enBestilling = await _db.Bestillinger.FindAsync(id);
                return enBestilling;
            }
            catch
            {
                return null;
            }
        }

        public async Task<List<Bestillinger>> HentBestillinger()
        {
            List<Bestillinger> alleBestillinger = await _db.Bestillinger.ToListAsync();
            return alleBestillinger;
        }

        public async Task<bool> LagreBestilling(Bestillinger bestillingInn)
        {
            try
            {
                var nybestilling = new Bestillinger();
                nybestilling.antall = bestillingInn.antall;
                nybestilling.Kunder = await _db.Kunder.FindAsync(bestillingInn.Kunder.kId);
                nybestilling.Aksjer = await _db.Aksjer.FindAsync(bestillingInn.Aksjer.Id);

                var prisAksje = nybestilling.Aksjer.Pris;
                var saldo = nybestilling.Kunder.balance;
                var nySaldo = saldo - (prisAksje * nybestilling.antall);

                if (nySaldo < 0)
                {
                    return false;
                }
                else
                {
                    nybestilling.Kunder.balance = nySaldo;
                    List<Bestillinger> alleBestillinger = await _db.Bestillinger.Where(k => k.Kunder.kId == bestillingInn.Kunder.kId).ToListAsync();
                    List<Bestillinger> alleAksjer = await _db.Bestillinger.Where(a => a.Aksjer.Id == bestillingInn.Aksjer.Id).ToListAsync();
                    if (alleBestillinger.Count > 0 && alleAksjer.Count > 0)
                    {
                        foreach (Bestillinger bestilling in alleBestillinger)
                        {
                            if (bestilling.Kunder.kId == bestillingInn.Kunder.kId && bestilling.Aksjer.Id == bestillingInn.Aksjer.Id)
                            {
                                var bId = bestilling.bId;
                                var antall = bestilling.antall;
                                Bestillinger enBestilling = await _db.Bestillinger.FindAsync(bId);
                                enBestilling.antall = bestillingInn.antall + antall;
                            }
                        }
                    }
                    else
                    {
                        _db.Bestillinger.Add(nybestilling);
                    }
                }
                await _db.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<Bestillinger> SlettBestilling(Bestillinger bestillingInn)
        {
            try
            {
                Bestillinger enBestilling = await _db.Bestillinger.FindAsync(bestillingInn.bId);
                var pris = enBestilling.Aksjer.Pris;
                var saldo = enBestilling.Kunder.balance;

                if (bestillingInn.antall == enBestilling.antall)
                {
                    enBestilling.Kunder.balance = (pris * enBestilling.antall) + saldo;
                    _db.Bestillinger.Remove(enBestilling);
                } else if (bestillingInn.antall < enBestilling.antall)
                {
                    enBestilling.antall -= bestillingInn.antall;
                    enBestilling.Kunder.balance = (pris * bestillingInn.antall) + saldo;
                }

                await _db.SaveChangesAsync();
                return enBestilling;
            }
            catch
            {
                return null;
            }
        }
        public async Task<bool> SlettHeleBestilling(Bestillinger bestillingInn)
        {
            try
            {

                Bestillinger enBestilling = await _db.Bestillinger.FindAsync(bestillingInn.bId);
                var pris = enBestilling.Aksjer.Pris;
                var saldo = enBestilling.Kunder.balance;
                enBestilling.Kunder.balance = (pris * enBestilling.antall) + saldo;

                _db.Bestillinger.Remove(enBestilling);
                await _db.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> SlettKunde(Kunder kundeInn)
        {
            try
            {
                Kunder enKunde = await _db.Kunder.FindAsync(kundeInn.kId);
                List<Bestillinger> alleBestillinger = await _db.Bestillinger.ToListAsync();

                foreach(Bestillinger bestilling in alleBestillinger)
                {
                    if (bestilling.Kunder.kId == kundeInn.kId)
                    {
                        _db.Bestillinger.Remove(bestilling);
                    }
                }
                _db.Kunder.Remove(enKunde);
                await _db.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
