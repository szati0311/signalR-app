using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddSignalR();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173") 
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Background service to send random messages
builder.Services.AddHostedService<RandomMessageService>();

var app = builder.Build();

app.UseCors("AllowReactApp");
app.MapHub<ChatHub>("/chat");

app.Run();


// -------------------- Hub --------------------

public class ChatHub : Hub
{
    public Task SendMessage(string user, string message)
    {
        return Clients.All.SendAsync("ReceiveMessage", user, message);
    }
}

// ---------------- Background service ----------------

public class RandomMessageService : BackgroundService
{
    private readonly IHubContext<ChatHub> _hubContext;
    private readonly string[] _randomTexts = new[]
    {
        "Hello from .NET 8 🚀",
        "SignalR is working fine!",
        "Random message at " + DateTime.Now,
        "How’s it going?"
    };

    public RandomMessageService(IHubContext<ChatHub> hubContext)
    {
        _hubContext = hubContext;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var rnd = new Random();

        while (!stoppingToken.IsCancellationRequested)
        {
            var message = _randomTexts[rnd.Next(_randomTexts.Length)];
            
            await _hubContext.Clients.All.SendAsync("ReceiveMessage", "Server", message, cancellationToken: stoppingToken);


            // wait 10 seconds (instead of 1 minute for faster testing)
            await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
        }
    }
}
