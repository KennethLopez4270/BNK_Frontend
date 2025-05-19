@echo off
echo Iniciando todos los microfrontends con preview...

start cmd /k "cd frt1-clientes && npm run start-mf"
start cmd /k "cd frt2-cuentas && npm run start-mf"
start cmd /k "cd frt3-pagos && npm run start-mf"
start cmd /k "cd frt4-transferencias && npm run start-mf"
start cmd /k "cd frt5-prestamos && npm run start-mf"
start cmd /k "cd shell && npm run dev"
