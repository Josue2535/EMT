using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMT.Controllers.Info
{
    public class ClinicalHistoryController : Controller
    {
        // GET: ClinicalHistoryController
        public ActionResult Index()
        {
            return View();
        }

        // GET: ClinicalHistoryController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: ClinicalHistoryController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: ClinicalHistoryController/Create
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

        // GET: ClinicalHistoryController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: ClinicalHistoryController/Edit/5
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

        // GET: ClinicalHistoryController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: ClinicalHistoryController/Delete/5
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
