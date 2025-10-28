# Test Timezone Implementation for Booking Slots
# Usage: .\test-timezone.ps1

Write-Host "🧪 Testing Timezone Implementation..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8000"
$slug = "30-min-meeting"
$today = Get-Date -Format "yyyy-MM-dd"

Write-Host "📅 Test Date: $today" -ForegroundColor Blue
Write-Host ""

function Test-Timezone {
    param(
        [string]$TimezoneName,
        [string]$TimezoneId
    )
    
    Write-Host "Test: $TimezoneName ($TimezoneId)" -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/api/bookings/public/$slug/slots?start_date=$today&end_date=$today&timezone=$TimezoneId" -Method Get
        
        if ($response.success -and $response.data.Count -gt 0) {
            Write-Host "✅ Success! Found $($response.data.Count) slots" -ForegroundColor Green
            
            # Display first 3 slots
            $response.data[0..2] | ForEach-Object {
                $start = [DateTime]::Parse($_.start_time).ToString("HH:mm")
                $end = [DateTime]::Parse($_.end_time).ToString("HH:mm")
                $available = if ($_.available) { "✓" } else { "✗" }
                Write-Host "  $start - $end | Available: $available"
            }
        } else {
            Write-Host "⚠️  No slots found" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Run tests
Test-Timezone -TimezoneName "Bangkok (UTC+7)" -TimezoneId "Asia/Bangkok"
Test-Timezone -TimezoneName "New York (UTC-5)" -TimezoneId "America/New_York"
Test-Timezone -TimezoneName "London (UTC+0)" -TimezoneId "Europe/London"
Test-Timezone -TimezoneName "Tokyo (UTC+9)" -TimezoneId "Asia/Tokyo"

Write-Host "Test: No timezone parameter (default UTC)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/bookings/public/$slug/slots?start_date=$today&end_date=$today" -Method Get
    
    if ($response.success -and $response.data.Count -gt 0) {
        Write-Host "✅ Success! Found $($response.data.Count) slots (UTC)" -ForegroundColor Green
        
        $response.data[0..2] | ForEach-Object {
            $start = [DateTime]::Parse($_.start_time).ToString("HH:mm")
            $end = [DateTime]::Parse($_.end_time).ToString("HH:mm")
            $available = if ($_.available) { "✓" } else { "✗" }
            Write-Host "  $start - $end | Available: $available"
        }
    } else {
        Write-Host "⚠️  No slots found" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ All tests completed!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Check server logs for timezone conversion details" -ForegroundColor Cyan
Write-Host "   Look for lines: 'Generating slots for user ... in timezone: ...'" -ForegroundColor Gray
