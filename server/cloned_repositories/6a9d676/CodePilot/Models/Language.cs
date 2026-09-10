namespace CodePilot.Models
{
    public class Language
    {
        public int LanguageId { get; set; }
        public string Name { get; set; }
        public ICollection<QuestionLanguage> QuestionLanguages { get; set; }
    }
}
