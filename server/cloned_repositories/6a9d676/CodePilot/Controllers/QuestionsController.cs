using Microsoft.AspNetCore.Mvc;
using CodePilot.Data;
using CodePilot.Services;
using CodePilot.Models;
using System.Diagnostics;
using Microsoft.EntityFrameworkCore;

namespace CodePilot.Controllers
{
    public class QuestionsController : Controller
    {
        private readonly ApplicationDbContext _context;
        public QuestionsController(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IActionResult> Index()
        {
            var questions = await _context.Questions.ToListAsync();
            return View(questions);
        }
        //public IActionResult Details(int id)
        //{
        //    var question = _context.Questions.FirstOrDefault(q => q.Id == id);
        //    return View(question);
        //}
        [HttpPost]
        //public IActionResult SubmitCode(CodeSubmission submission)
        //{
        //    submission.SubmissionTime = DateTime.Now;
        //    submission.Result = Execute(submission.Code, submission.Language);
        //    _context.CodeSubmissions.Add(submission);
        //    _context.SaveChanges();

        //    ViewBag.Result = submission.Result;
        //    var question = _context.Questions.FirstOrDefault(q => q.Id == submission.QuestionId);
        //    return View("Details", question);
        //}
        private string Execute(string code, string language)
        {
            string output = string.Empty;
            string tempFilePath = Path.Combine(Path.GetTempPath(), $"temp_code.{GetFileExtension(language)}");

            System.IO.File.WriteAllText(tempFilePath, code);

            var dockerImage = GetDockerImage(language);
            var dockerCommand = $"docker run --rm -v \"{tempFilePath}:/code/{Path.GetFileName(tempFilePath)}\" {dockerImage} {GetArguments($"/code/{Path.GetFileName(tempFilePath)}", language)}";

            var startInfo = new ProcessStartInfo
            {
                FileName = "cmd",
                Arguments = $"/c {dockerCommand}",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true,
            };

            using (var process = Process.Start(startInfo))
            {
                using (var reader = process.StandardOutput)
                {
                    output = reader.ReadToEnd();
                }
                using (var reader = process.StandardError)
                {
                    output += reader.ReadToEnd();
                }
            }

            System.IO.File.Delete(tempFilePath);
            return output;
        }

        private string GetFileExtension(string language)
        {
            return language switch
            {
                "python" => "py",
                "csharp" => "cs",
                "javascript" => "js",
                _ => "txt",
            };
        }
        private string GetDockerImage(string language)
        {
            return language switch
            {
                "python" => "python:3.9",
                "csharp" => "mcr.microsoft.com/dotnet/sdk:5.0",
                "javascript" => "node:14",
                _ => "ubuntu",
            };
        }

        private string GetArguments(string filePath, string language)
        {
            return language switch
            {
                "python" => filePath,
                "csharp" => $"/c {filePath} && {Path.ChangeExtension(filePath, ".exe")}",
                "javascript" => filePath,
                _ => filePath,
            };
        }
    }
}
