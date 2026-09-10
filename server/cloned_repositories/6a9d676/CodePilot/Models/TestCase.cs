namespace CodePilot.Models
{
    public class TestCase
    {
        public int TestCaseId { get; set; }
        public int QuestionId { get; set; }
        public Question Question { get; set; }
        public int LanguageId { get; set; }
        public Language Language { get; set; }
        public string Input { get; set; }
        public string ExpectedOutput { get; set; }
    }
}
