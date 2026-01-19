# build_schema.ps1
# Combines all SQL modules into a single schema.sql file

$modulesDir = $PSScriptRoot
$outputFile = Join-Path (Split-Path $PSScriptRoot -Parent) "schema.sql"

$files = @(
    "00_setup.sql",
    "01_auth.sql",
    "02_calendar.sql",
    "03_booking.sql",
    "04_tasks.sql",
    "05_teams.sql",
    "06_blog.sql",
    "07_sync.sql",
    "08_notifications.sql",
    "09_ai.sql",
    "10_contacts.sql",
    "11_context.sql",
    "12_hybrid_search.sql",
    "13_booking_links_location.sql"
)

Write-Host "Building schema..."
New-Item -ItemType File -Path $outputFile -Force | Out-Null
Clear-Content $outputFile -ErrorAction SilentlyContinue

foreach ($file in $files) {
    $path = Join-Path $modulesDir $file
    if (Test-Path $path) {
        Write-Host "Adding $file"
        Get-Content $path | Add-Content $outputFile
        Add-Content $outputFile "`n`n"
    } else {
        Write-Warning "File not found: $path"
    }
}

Write-Host "Schema build complete: $outputFile"
