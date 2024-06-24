using Microsoft.Extensions.Hosting;

namespace Infrastructure.Common.Extension
{
    public static class EnvironmentChecker
    {
        private static IHostEnvironment _hostEnvironment;

        public static void Initialize(IHostEnvironment hostEnvironment)
        {
            _hostEnvironment = hostEnvironment;
        }

        public static bool IsProduction()
        {
            return _hostEnvironment?.IsProduction() ?? false;
        }

        public static string GetCurrentEnvironment()
        {
            return _hostEnvironment?.EnvironmentName;
        }
    }
}
