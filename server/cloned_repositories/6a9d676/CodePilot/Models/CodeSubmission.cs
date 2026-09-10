namespace CodePilot.Models
{
    public class CodeSubmission
    {
        public int Id { get; set; }
        public int QuestionId { get; set; }
        public string Code { get; set; }
        public string Language { get; set; }
        public string UserId { get; set; }
        public string Result { get; set; }
        public DateTime SubmissionTime { get; set; }
    }
}