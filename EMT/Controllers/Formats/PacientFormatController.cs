using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMT.Controllers.Formats
{
    public class PacientFormatController : Controller
    {
        // GET: PacientFormatController
        public ActionResult Index()
        {
            return View();
        }

        // GET: PacientFormatController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: PacientFormatController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: PacientFormatController/Create
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

        // GET: PacientFormatController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: PacientFormatController/Edit/5
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

        // GET: PacientFormatController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: PacientFormatController/Delete/5
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
