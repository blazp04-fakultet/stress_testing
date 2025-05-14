param(
    [Parameter(Mandatory=$true)]
    [string]$Name
)

# Get current timestamp in the format ddmmyyyyhhmmss
$timestamp = Get-Date -Format "ddMMyyyyHHmmss"

# Construct the filename
$filename = "${timestamp}_${Name}.sql"

# Construct the full path (assuming the script is run from the project root)
$path = Join-Path -Path (Join-Path -Path (Join-Path -Path "src" -ChildPath "core") -ChildPath "db") -ChildPath "migrations"
$fullPath = Join-Path -Path $path -ChildPath $filename

# Create the directory if it doesn't exist
if (-not (Test-Path -Path $path)) {
    New-Item -Path $path -ItemType Directory
}

# Create the file
New-Item -Path $fullPath -ItemType File

Write-Host "Created file: $fullPath"