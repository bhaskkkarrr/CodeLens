using Microsoft.EntityFrameworkCore;
using CodePilot.Models;

namespace CodePilot.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
        {
        }

        public DbSet<Question> Questions { get; set; }
        public DbSet<Language> Languages { get; set; }
        public DbSet<QuestionLanguage> QuestionLanguages { get; set; }
        public DbSet<TestCase> TestCases { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Define composite key for QuestionLanguage
            modelBuilder.Entity<QuestionLanguage>()
                .HasKey(ql => new { ql.QuestionId, ql.LanguageId });

            // Seed data for Languages
            modelBuilder.Entity<Language>().HasData(
                new Language { LanguageId = 1, Name = "python" },
                new Language { LanguageId = 2, Name = "csharp" }
            );
        }
    }
}
