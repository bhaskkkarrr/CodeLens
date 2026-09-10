namespace CodePilot.Models
{
    public class QuestionLanguage
    {
        public int QuestionId { get; set; }
        public Question Question { get; set; }
        public int LanguageId { get; set; }
        public Language Language { get; set; }
    }
}
