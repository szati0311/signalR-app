using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);

// ---------------------------
// 1. CORS policy
// ---------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactCors", policy =>
    {
        policy.WithOrigins("*") // React dev server
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // KÖTELEZŐ SignalR WebSocket-hez
    });
});

// ---------------------------
// 2. SignalR + BackgroundService
// ---------------------------
builder.Services.AddSignalR();
builder.Services.AddHostedService<MessageService>();

var app = builder.Build();

// ---------------------------
// 3. Middleware sorrend kritikus
// ---------------------------
app.UseRouting();

// A CORS middleware MINDEN hub map előtt
app.UseCors("ReactCors");

// Hub map
app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<ChatHub>("/chat");
});

app.Run();

// ---------------------------
// 4. SignalR Hub
// ---------------------------
public class ChatHub : Hub { }

// ---------------------------
// 5. BackgroundService - random üzenetek
// Teszteléshez: Task.Delay(TimeSpan.FromSeconds(5))
public class MessageService : BackgroundService
{
    private readonly IHubContext<ChatHub> _hubContext;
    private readonly Random _rand = new Random();

    private readonly string[] messages = new[]
    {
        "Helló, itt a szerver 🚀",
        "Ez egy random üzenet 📩",
        "Hogy telik a napod? 🌞",
        "Ez csak egy teszt 🔧",
        "Random message incoming 🎲"
    };

    public MessageService(IHubContext<ChatHub> hubContext)
    {
        _hubContext = hubContext;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var msg = messages[_rand.Next(messages.Length)];
            await _hubContext.Clients.All.SendAsync("ReceiveMessage", "Server", msg);

            await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken); // gyors teszt
        }
    }
}
