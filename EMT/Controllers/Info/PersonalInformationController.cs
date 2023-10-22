using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMT.Controllers.Info
{
    public class PersonalInformationController : Controller
    {
        // GET: PersonalInformationController
        public ActionResult Index()
        {
            return View();
        }

        // GET: PersonalInformationController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: PersonalInformationController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: PersonalInformationController/Create
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

        // GET: PersonalInformationController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: PersonalInformationController/Edit/5
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

        // GET: PersonalInformationController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: PersonalInformationController/Delete/5
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
