namespace CodePilot.Models
{
    public class Question
    {
        public int QuestionId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public ICollection<QuestionLanguage> QuestionLanguages { get; set; }
    }
}
