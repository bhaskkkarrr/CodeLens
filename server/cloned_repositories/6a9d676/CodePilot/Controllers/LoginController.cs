using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using CodePilot.Models;
using CodePilot.Services;

namespace CodePilot.Controllers
{
    public class LoginController : Controller
    {
        private readonly InMemoryUserStore _userStore;
        public LoginController(InMemoryUserStore userStore)
        {
            _userStore = userStore;
        }

        [HttpGet]
        public IActionResult Login()
        {
            ViewData["IsLoginPage"] = true;
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Login(Login login)
        {
            if (ModelState.IsValid)
            {
                if (_userStore.ValidateUser(login.Username, login.Password, out var role))
                {
                    var claims = new[]
                    {
                    new Claim(ClaimTypes.Name, login.Username),
                    new Claim(ClaimTypes.Role, role)
                };
                    var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                    var principal = new ClaimsPrincipal(identity);

                    var properties = new AuthenticationProperties
                    {
                        IsPersistent = login.RememberMe
                    };

                    await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, properties);

                    return RedirectToAction("Index", "Home"); // Redirect to a secure area
                }
                ViewBag.ErrorMessage = "Invalid username or password";

                ModelState.AddModelError(string.Empty, "Invalid login attempt.");
            }

            return View(login);
        }
        //[HttpPost]
        [HttpGet]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Login", "Login");
        }
    }
}
