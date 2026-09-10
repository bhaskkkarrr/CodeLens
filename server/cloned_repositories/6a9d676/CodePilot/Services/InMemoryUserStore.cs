namespace CodePilot.Services
{
    public class InMemoryUserStore
    {
        private readonly Dictionary<string, (string Password, string Role)> _users = new Dictionary<string, (string Password, string Role)>
        {
            { "user1", ("password1", "User") },
            { "vaini", ("vaini1234", "Admin") }
        };
        public bool ValidateUser(string username, string password, out string role)
        {
            if (_users.TryGetValue(username, out var user) && user.Password == password)
            {
                role = user.Role;
                return true;
            }

            role = null;
            return false;
        }
    }
}
