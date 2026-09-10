namespace CodePilot.Models
{
    public class TestCaseResult
    {
        public string Input { get; set; }
        public string ExpectedOutput { get; set; }
        public string ActualOutput { get; set; }
        public bool IsCorrect { get; set; }
    }
}
