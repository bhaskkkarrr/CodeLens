using CodePilot.Data;
using CodePilot.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CodePilot.Controllers
{
    public class CodeExecutionController : Controller
    {
        private readonly ApplicationDbContext _context;
        public CodeExecutionController(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IActionResult> Index()
        {
            var questions = await _context.Questions.ToListAsync();
            return View(questions);
        }
        [HttpPost]
        public async Task<IActionResult> SubmitCode(int questionId, string code, string language)
        {
            var question = await _context.Questions
                .Include(q => q.QuestionLanguages)
                .SingleOrDefaultAsync(q => q.QuestionId == questionId);

            if (question == null)
            {
                return NotFound();
            }

            var languageId = await _context.Languages
                .Where(l => l.Name == language)
                .Select(l => l.LanguageId)
                .SingleOrDefaultAsync();

            if (languageId == 0)
            {
                return BadRequest("Invalid language.");
            }

            // Get test cases for the question and language
            var testCases = await _context.TestCases
                .Where(tc => tc.QuestionId == questionId && tc.LanguageId == languageId)
                .ToListAsync();

            var results = new List<TestCaseResult>();

            foreach (var testCase in testCases)
            {
                var output = await ExecuteCode(code, language, testCase.Input);
                var isCorrect = output.Trim() == testCase.ExpectedOutput.Trim();
                results.Add(new TestCaseResult
                {
                    Input = testCase.Input,
                    ExpectedOutput = testCase.ExpectedOutput,
                    ActualOutput = output,
                    IsCorrect = isCorrect
                });
            }

            return View("Results", results);
        }

        private async Task<string> ExecuteCode(string code, string language, string input)
        {
            // Simulate code execution with delay
            await Task.Delay(500);

            // For now, this method just returns mocked output
            // You will need to integrate with an actual execution engine
            return "Mocked Output"; // Replace with actual code execution logic
        }
    }
}
