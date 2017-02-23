using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TheWorld.ViewModels;
using TheWorld.Services;
using Microsoft.Extensions.Configuration;
using TheWorld.Models;

namespace TheWorld.Controllers.Web
{
    public class AppController : Controller
    {
        private IMailService _mailService;
        private IConfigurationRoot _config;
        private IWorldRepository _repository;

        public AppController(IMailService mailService, IConfigurationRoot config, IWorldRepository repository)
        {
            _mailService = mailService;
            _config = config;
            _repository = repository;
        }

        public IActionResult Index()
        {
            var data = _repository.GetAllTrips();

            return View(data);
        }

        public IActionResult Contact()
        {
            return View();
        }
        
        [HttpPost]
        public IActionResult Contact(ContactViewModel model)
        {
            if (model.Email.Contains("aol.com"))
            {
                ModelState.AddModelError("Email", "AOL not supported.");
            }

            if (ModelState.IsValid)
            {
                _mailService.SendMail(_config["MailSettings:ToAddress"], model.Email, "Subject", model.Message);
                ModelState.Clear();
                ViewBag.UserMessage = "Message sent";
            }
            return View();
        }

        public IActionResult About()
        {
            return View();
        }
    }
}
