using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EMT.Controllers.Formats
{
    public class PersonalInformationFormatController : Controller
    {
        // GET: PersonalInformationFormatController
        public ActionResult Index()
        {
            return View();
        }

        // GET: PersonalInformationFormatController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: PersonalInformationFormatController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: PersonalInformationFormatController/Create
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

        // GET: PersonalInformationFormatController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: PersonalInformationFormatController/Edit/5
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

        // GET: PersonalInformationFormatController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: PersonalInformationFormatController/Delete/5
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
