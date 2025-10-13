@echo off
echo ========================================
echo INSTALANDO TODAS LAS DEPENDENCIAS
echo ========================================

echo Instalando frt1-clientes...
cd frt1-clientes && npm install
cd ..

echo Instalando frt2-cuentas...
cd frt2-cuentas && npm install
cd ..

echo Instalando frt3-pagos...
cd frt3-pagos && npm install
cd ..

echo Instalando frt4-transferencias...
cd frt4-transferencias && npm install
cd ..

echo Instalando frt5-prestamos...
cd frt5-prestamos && npm install
cd ..

echo Instalando schell...
cd schell && npm install
cd ..

echo ========================================
echo TODAS LAS DEPENDENCIAS INSTALADAS!
echo ========================================
pause