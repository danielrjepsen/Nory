FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS base

RUN addgroup -g 1001 -S dotnet && \
    adduser -S -u 1001 -G dotnet dotnet

RUN apk update && apk upgrade && \
    apk add --no-cache curl dumb-init && \
    rm -rf /var/cache/apk/*

WORKDIR /app

FROM base AS deps
WORKDIR /app
COPY src/Nory.Core/*.csproj ./src/Nory.Core/
COPY src/Nory.Application/*.csproj ./src/Nory.Application/
COPY src/Nory.Infrastructure/*.csproj ./src/Nory.Infrastructure/
COPY src/Nory.Api/*.csproj ./src/Nory.Api/
RUN dotnet restore src/Nory.Api/Nory.Api.csproj

FROM base AS development
WORKDIR /app

# Copy restored packages from deps stage and set up dotnet user home
RUN mkdir -p /home/dotnet/.nuget/packages && \
    chown -R dotnet:dotnet /home/dotnet
COPY --from=deps --chown=dotnet:dotnet /root/.nuget/packages /home/dotnet/.nuget/packages

# Copy all source files with proper ownership
COPY --chown=dotnet:dotnet . ./

# Create necessary directories with proper permissions
RUN mkdir -p /app/uploads /app/obj /app/bin /tmp/dotnet-build && \
    chown -R dotnet:dotnet /app /tmp/dotnet-build

# Set proper permissions for cache directories 
RUN chmod 755 /app/obj /app/bin

ENV ASPNETCORE_URLS=http://0.0.0.0:5000
ENV ASPNETCORE_ENVIRONMENT=Development
ENV DOTNET_USE_POLLING_FILE_WATCHER=true
ENV DOTNET_RUNNING_IN_CONTAINER=true
# Performance optimizations
ENV DOTNET_ReadyToRun=0
ENV DOTNET_TieredPGO=1
ENV DOTNET_TC_QuickJitForLoops=1
ENV DOTNET_TieredCompilation=true
# Memory optimizations
ENV DOTNET_GCServer=false
ENV DOTNET_GCConserveMemory=9

# Security: Switch to non-root user
USER dotnet

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Use dumb-init as PID 1 for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start with dotnet watch for hot reload
CMD ["dotnet", "watch", "run", "--project", "src/Nory.Api/Nory.Api.csproj", "--urls=http://0.0.0.0:5000", "--no-restore"]

#build
FROM base AS build
WORKDIR /app

# Copy restored packages from deps stage
COPY --from=deps /root/.nuget/packages /root/.nuget/packages

# Copy all source code
COPY src/ ./src/

# Build and publish in one step (simpler and more reliable)
RUN dotnet publish src/Nory.Api/Nory.Api.csproj -c Release -o /app/publish

#prod runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS production
WORKDIR /app

# Install runtime dependencies
RUN apk update && apk upgrade && \
    apk add --no-cache curl dumb-init && \
    rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup -g 1001 -S dotnet && \
    adduser -S -u 1001 -G dotnet dotnet

# Copy published application
COPY --from=build --chown=dotnet:dotnet /app/publish .

# Create necessary directories
RUN mkdir -p /app/uploads && \
    chown -R dotnet:dotnet /app

# Production environment
ENV ASPNETCORE_URLS=http://0.0.0.0:5000
ENV ASPNETCORE_ENVIRONMENT=Production
ENV DOTNET_RUNNING_IN_CONTAINER=true
ENV DOTNET_ReadyToRun=0
ENV DOTNET_TieredPGO=1
ENV DOTNET_TC_QuickJitForLoops=1

# Switch to non-root user
USER dotnet

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["dotnet", "Nory.Api.dll"]