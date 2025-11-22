# ===============================
# F-RUN.PS1: Gestione Job Node
# ===============================

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("dev", "staging", "prod")]
    [string]$mode
)

Write-Host "Modalità selezionata: $mode" -ForegroundColor Cyan

$root = Get-Location
$frontendFolder = Join-Path $root "frontend" "AssicuraApp"
$frontendJob = $null
$currentMode = $mode

# -------------------------------
# Funzione per creare e avviare un job
# -------------------------------
function Start-FrontendJob($mode) {
    switch ($mode) {
        "dev" {
            return Start-Job -Name "Frontend" -ScriptBlock {
                Set-Location $using:frontendFolder
                npm run dev
            }
        }
        "staging" {
            return Start-Job -Name "Frontend" -ScriptBlock {
                Set-Location $using:frontendFolder
                npm run build
                npm run start
            }
        }
        "prod" {
            return Start-Job -Name "Frontend" -ScriptBlock {
                Set-Location $using:frontendFolder
                docker build -t assicura-app .
                docker run -p 3000:3000 assicura-app
            }
        }
    }
}

# -------------------------------
# Funzione per mostrare job attivi
# -------------------------------
function Show-Jobs() {
    $jobs = Get-Job
    if ($jobs.Count -eq 0) {
        Write-Host "Nessun job attivo." -ForegroundColor Yellow
    } else {
        Write-Host "Job attivi:" -ForegroundColor Cyan
        $jobs | Format-Table Id, Name, State, HasMoreData
    }
}

# -------------------------------
# Funzione per leggere output del job (statico)
# -------------------------------
function Show-JobOutput($jobId) {
    Write-Host "`n=== Output Job Id $jobId ===" -ForegroundColor Cyan
    $output = Receive-Job -Id $jobId -Keep
    if ($output) {
        $output | ForEach-Object { Write-Host $_ }
    } else {
        Write-Host "(Nessun output disponibile)" -ForegroundColor Yellow
    }
    Write-Host "=========================`n" -ForegroundColor Cyan
}

# -------------------------------
# Funzione per leggere output live del job
# -------------------------------
function Show-JobLive($jobId) {
    Write-Host "`n=== Log live Job Id $jobId ===" -ForegroundColor Cyan
    while ((Get-Job -Id $jobId).State -eq "Running") {
        Receive-Job -Id $jobId -Keep | ForEach-Object { Write-Host $_ }
        Start-Sleep 1
    }
    # Output finale
    Receive-Job -Id $jobId | ForEach-Object { Write-Host $_ }
    Write-Host "=== Fine Log Job ===`n" -ForegroundColor Cyan
}

# -------------------------------
# Funzione per fermare e rimuovere un job
# -------------------------------
function Stop-AndRemoveJob($jobId) {
    Stop-Job -Id $jobId
    Remove-Job -Id $jobId
    Write-Host "Job $jobId fermato e rimosso." -ForegroundColor Green
}

# ===============================
# Avvio job frontend
# ===============================
$frontendJob = Start-FrontendJob $mode
Write-Host "Frontend Job avviato: Id $($frontendJob.Id)" -ForegroundColor Green

# ===============================
# Menu interattivo per gestione job
# ===============================
do {
    Clear-Host
    Write-Host "=== Menu Job Frontend ===" -ForegroundColor Cyan
    Write-Host "1) Mostra job attivi"
    Write-Host "2) Mostra output job (statico)"
    Write-Host "3) Mostra output job live"
    Write-Host "4) Stop + rimuovi job"
    Write-Host "5) Riavvia job (stesso ambiente)"
    Write-Host "6) Esci e pulisci tutti i job"
    
    $choice = Read-Host "Scegli un'opzione"

    switch ($choice) {
        "1" { 
            Show-Jobs
            Read-Host "Premi Invio per tornare al menu"
        }
        "2" { 
            $id = Read-Host "Inserisci Id job"
            Show-JobOutput $id
            Read-Host "Premi Invio per tornare al menu"
        }
        "3" {
            $id = Read-Host "Inserisci Id job"
            Show-JobLive $id
            Read-Host "Premi Invio per tornare al menu"
        }
        "4" { 
            $id = Read-Host "Inserisci Id job da fermare"
            Stop-AndRemoveJob $id
            Read-Host "Premi Invio per tornare al menu"
        }
        "5" {
            # Riavvio solo nello stesso ambiente
            $jobs = Get-Job | Where-Object {$_.Name -eq "Job-Frontend"}
            if ($jobs.Count -eq 0) {
                Write-Host "Nessun job attivo. Riavvio nello stesso ambiente." -ForegroundColor Yellow
            } else {
                Write-Host "Riavvio job nello stesso ambiente: $currentMode" -ForegroundColor Yellow
                Stop-AndRemoveJob $frontendJob.Id
            }
            $frontendJob = Start-FrontendJob $currentMode
            Write-Host "Job riavviato: Id $($frontendJob.Id)" -ForegroundColor Green
            Read-Host "Premi Invio per tornare al menu"
        }
        "6" { 
            Write-Host "Chiusura script e pulizia job..." -ForegroundColor Cyan
            Get-Job | Stop-Job
            Get-Job | Remove-Job
            exit
        }
        default { 
            Write-Host "Opzione non valida" -ForegroundColor Red
            Start-Sleep 1
        }
    }
} while ($true)

# Torna alla cartella originale
Set-Location $root
Write-Host "Script terminato." -ForegroundColor Cyan
