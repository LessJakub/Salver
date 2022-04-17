# Salver
## Software Project

## Using .NET to run both Frontend and Backend of the application:
```sh
# Running .NET backend
cd API/
dotnet run

# Running Angular frontend
cd Client/
ng serve
# Requires .NET 6.0, Angular@12, Node 16.12, Entity Framework and maybe something else.
```

## Using Docker
From main repository directory (where `docker-compose.yaml` file resides):
```sh
# Use this command to run both, backend and frontend:
docker compose up

# To selectively run either Client or API, use:
docker compose up API
# or / and
docker compose up Client


# To clear old cache in case of issues:
docker system prune -a --volumes
# Proceed with caution!
# This clears ALL cache. Rebuilding containers will take much more time, all data needs to be re-downloaded.

# Hot-reload is supported on both Windows and macOS. While your docker is running, you can change
# files inside of Client/ and changes will be reflected almost instantly.
```

For both configurations (either Native or Docker) ports are as follows:
- Frontend: 4200
- Backend: 8080
