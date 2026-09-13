Add-Type -AssemblyName System.Drawing

$srcDir  = "d:\web\WEB BAHAGIA STUDIO\assets\images\Comp 2"
$destDir = "d:\web\WEB BAHAGIA STUDIO\assets\images\Comp2_full150_jpg"

if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir | Out-Null
}

# Konversi SELURUH 150 FRAME (frame 0 s/d 149) ke JPEG 1440px terkompresi
for ($i = 0; $i -lt 150; $i++) {
    $srcName = "Comp 2_" + ($i.ToString("D5")) + ".png"
    $srcPath = Join-Path $srcDir $srcName

    if (Test-Path $srcPath) {
        $destName = "frame_" + ($i.ToString("D3")) + ".jpg"
        $destPath = Join-Path $destDir $destName

        $img = [System.Drawing.Image]::FromFile($srcPath)
        
        # Resize ke Max Width 1440px
        $targetWidth = [Math]::Min($img.Width, 1440)
        $targetHeight = [int]($img.Height * ($targetWidth / $img.Width))

        $bmp = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.DrawImage($img, 0, 0, $targetWidth, $targetHeight)

        # Enkoder JPEG dengan Quality 82%
        $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 82)

        $bmp.Save($destPath, $jpegCodec, $encoderParams)

        $g.Dispose()
        $bmp.Dispose()
        $img.Dispose()

        Write-Host "Converted frame $i / 149"
    }
}

Write-Host "Optimization complete! Total 150 frames processed."
