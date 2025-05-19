@echo off
start cmd /k "cd frt1-clientes && npm run dev -- --port 5173"
start cmd /k "cd frt2-cuentas && npm run dev -- --port 5174"
start cmd /k "cd frt3-pagos && npm run dev -- --port 5175"
start cmd /k "cd frt4-transferencias && npm run dev -- --port 5176"
start cmd /k "cd frt5-prestamos && npm run dev -- --port 5177"
start cmd /k "cd shell && npm run dev -- --port 5178"