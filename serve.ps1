$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:3000/")
$listener.Start()
Write-Host "Server running at http://localhost:3000/"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        $path = $request.Url.LocalPath

        if ($path -eq "/") { $path = "/index.html" }
        $filePath = Join-Path (Get-Location) $path.TrimStart('/')

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()

            switch ($ext) {
                ".html" { $ct = "text/html" }
                ".css"  { $ct = "text/css" }
                ".js"   { $ct = "application/javascript" }
                ".png"  { $ct = "image/png" }
                ".jpg"  { $ct = "image/jpeg" }
                ".jpeg" { $ct = "image/jpeg" }
                ".svg"  { $ct = "image/svg+xml" }
                ".json" { $ct = "application/json" }
                ".woff2"{ $ct = "font/woff2" }
                default { $ct = "application/octet-stream" }
            }

            $response.ContentType = $ct
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }
        $response.OutputStream.Close()
    }
} finally {
    $listener.Stop()
}
