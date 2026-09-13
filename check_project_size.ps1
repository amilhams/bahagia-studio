$files = Get-ChildItem -Path "d:\web\WEB BAHAGIA STUDIO" -Recurse -File | Where-Object { $_.FullName -notmatch "Comp 2" }

$totalBytes = 0
$videoBytes = 0
$scrollyBytes = 0
$portoBytes = 0
$otherBytes = 0

foreach ($f in $files) {
    $totalBytes += $f.Length
    if ($f.Extension -match "\.(mp4|webm|mov)$") {
        $videoBytes += $f.Length
    } elseif ($f.FullName -match "Comp2_full150_jpg") {
        $scrollyBytes += $f.Length
    } elseif ($f.FullName -match "portofolio") {
        $portoBytes += $f.Length
    } else {
        $otherBytes += $f.Length
    }
}

Write-Host ("TOTAL_PROJECT_SIZE_MB: " + [math]::Round($totalBytes / 1MB, 2) + " MB")
Write-Host ("- VIDEO_FILES: " + [math]::Round($videoBytes / 1MB, 2) + " MB")
Write-Host ("- SCROLLYTELLING_150_FRAMES: " + [math]::Round($scrollyBytes / 1MB, 2) + " MB")
Write-Host ("- PORTFOLIO_PHOTOS: " + [math]::Round($portoBytes / 1MB, 2) + " MB")
Write-Host ("- OTHER_ASSETS_HTML_CSS_JS: " + [math]::Round($otherBytes / 1MB, 2) + " MB")
