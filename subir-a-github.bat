@echo off
title Subir Videocurriculum a GitHub - Maria Carrillo Carrasco
echo =====================================================================
echo    SUBIENDO CODIGO DE VIDEOCURRICULUM Y PROYECTOS A GITHUB
echo =====================================================================
echo.
echo Este script iniciara la subida a tu repositorio de GitHub:
echo https://github.com/MariaCarrilloCarrasco/videocurriculum
echo.
echo Nota: Si es necesario, aparecera una ventana emergente de GitHub 
echo para que inicies sesion y autorices la subida.
echo.
echo =====================================================================
echo.

git push -u origin main --force

echo.
echo =====================================================================
echo Proceso de subida completado. Ya puedes cerrar esta ventana.
echo =====================================================================
pause
