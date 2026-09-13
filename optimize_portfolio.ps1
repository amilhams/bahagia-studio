Add-Type -AssemblyName System.Drawing

$portfolioDir = "d:\web\WEB BAHAGIA STUDIO\assets\images\portofolio"

$files = Get-ChildItem -Path $portfolioDir -Recurse -File | Where-Object { $_.Extension -match "\.(jpg|jpeg|png)$" }

Write-Host "Found $($files.Count) portfolio images to inspect & optimize..."

$optimizedCount = 0
$totalSavedBytes = 0

foreach ($file in $files) {
    # Cek jika file berukuran di atas 800 KB (yang membuat halaman portfolio terasa berat/lama dimuat)
    if ($file.Length -gt 800KB) {
        $oldSize = $file.Length
        $tempPath = $file.FullName + ".tmp.jpg"

        try {
            $img = [System.Drawing.Image]::FromFile($file.FullName)
            
            # Resize ke Max Width 1920px (Full HD) untuk menjamin gambar super tajam & tidak pecah di layar besar
            $maxDim = 1920
            if ($img.Width -gt $maxDim -or $img.Height -gt $maxDim) {
                if ($img.Width -ge $img.Height) {
                    $newW = $maxDim
                    $newH = [int]($img.Height * ($maxDim / $img.Width))
                } else {
                    $newH = $maxDim
                    $newW = [int]($img.Width * ($maxDim / $img.Height))
                }
            } else {
                $newW = $img.Width
                $newH = $img.Height
            }

            $bmp = New-Object System.Drawing.Bitmap($newW, $newH)
            $g = [System.Drawing.Graphics]::FromImage($bmp)
            $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $g.DrawImage($img, 0, 0, $newW, $newH)

            # Enkoder JPEG dengan Quality 92% (Ultra-High Quality, tajam & bening tanpa artifact)
            $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
            $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
            $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 92)

            $bmp.Save($tempPath, $jpegCodec, $encoderParams)

            $g.Dispose()
            $bmp.Dispose()
            $img.Dispose()

            $newSize = (Get-Item $tempPath).Length

            # Hanya timpa jika ukuran baru lebih kecil
            if ($newSize -lt $oldSize) {
                Remove-Item $file.FullName -Force
                Rename-Item $tempPath -NewName $file.Name
                $saved = $oldSize - $newSize
                $totalSavedBytes += $saved
                $optimizedCount++
                $oldMB = [math]::Round($oldSize / 1MB, 2)
                $newMB = [math]::Round($newSize / 1MB, 2)
                Write-Host "Optimized: $($file.Name) [$oldMB MB -> $newMB MB]"
            } else {
                Remove-Item $tempPath -Force
            }
        } catch {
            if (Test-Path $tempPath) { Remove-Item $tempPath -Force }
            Write-Host "Error processing $($file.Name): $_"
        }
    }
}

$totalSavedMB = [math]::Round($totalSavedBytes / 1MB, 2)
Write-Host "Portfolio Image Optimization Completed! Total files optimized: $optimizedCount. Total memory saved: $totalSavedMB MB."
