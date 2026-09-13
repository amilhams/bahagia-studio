Add-Type -AssemblyName System.Drawing

$srcDir  = "d:\web\WEB BAHAGIA STUDIO\assets\images\Comp 2"
$destDir = "d:\web\WEB BAHAGIA STUDIO\assets\images\Comp2_optimized"

if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir | Out-Null
}

# Ambil frame kelipatan 3 (total 50 frame: 0, 3, 6, 9 ... 147)
$newIndex = 0
for ($i = 0; $i -lt 150; $i += 3) {
    $srcName = "Comp 2_" + ($i.ToString("D5")) + ".png"
    $srcPath = Join-Path $srcDir $srcName

    if (Test-Path $srcPath) {
        $destName = "frame_" + ($newIndex.ToString("D3")) + ".jpg"
        $destPath = Join-Path $destDir $destName

        $img = [System.Drawing.Image]::FromFile($srcPath)
        
        # Resize ke Max Width 1440px jika gambar terlalu besar
        $targetWidth = [Math]::Min($img.Width, 1440)
        $targetHeight = [int]($img.Height * ($targetWidth / $img.Width))

        $bmp = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.DrawImage($img, 0, 0, $targetWidth, $targetHeight)

        # Enkoder JPEG dengan Quality 80%
        $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 80)

        $bmp.Save($destPath, $jpegCodec, $encoderParams)

        $g.Dispose()
        $bmp.Dispose()
        $img.Dispose()

        Write-Host "Processed frame $newIndex (from original $i)"
        $newIndex++
    }
}

Write-Host "Optimization complete! Total frames created: $newIndex"
