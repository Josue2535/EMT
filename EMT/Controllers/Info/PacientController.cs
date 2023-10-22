using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMT.Controllers.Info
{
    public class PacientController : Controller
    {
        // GET: PacientController
        public ActionResult Index()
        {
            return View();
        }

        // GET: PacientController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: PacientController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: PacientController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: PacientController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: PacientController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: PacientController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: PacientController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}
