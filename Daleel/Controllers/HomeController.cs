using Daleel.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace Daleel.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Platforms()
        {
            return View();
        }

        public IActionResult Shop()
        {
            return View();
        }

        public IActionResult Trust()
        {
            return View();
        }

        public IActionResult Partners()
        {
            return View();
        }

        public IActionResult About()
        {
            return View();
        }

        public IActionResult Contact()
        {
            return View();
        }

        public IActionResult Soon()
        {
            return View();
        }



        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
