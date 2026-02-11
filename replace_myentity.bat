@echo off
setlocal enabledelayedexpansion

for /r "backend" %%f in (*.java) do (
    powershell -Command "(Get-Content '%%f') -replace 'myentity', 'User' | Set-Content '%%f'"
)

echo Replacement complete.
