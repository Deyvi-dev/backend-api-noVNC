#!/bin/sh

# Iniciar Xvfb
Xvfb :0 -screen 0 1280x720x24+32 -ac -nolisten tcp &

# Iniciar x11vnc
x11vnc -display :0 -forever -shared -rfbport 5900 -passwd 12345 &

# Iniciar noVNC
/opt/novnc/utils/launch.sh --listen 8080 --vnc localhost:5900 &

# Iniciar Openbox
DISPLAY=:0 openbox &

# Verificar se a variável de ambiente START_URL está definida e, em caso afirmativo, usá-la como a URL padrão
if [ -n "$START_URL" ]; then
    URL="$START_URL" # Usar a URL passada como argumento
    echo "Variável de ambiente START_URL definida. URL: ${URL}" # Mensagem de depuração
else
    URL="https://www.youtube.com/" # URL padrão, caso o arquivo não exista
    echo "Arquivo start_url.txt não encontrado e variável de ambiente START_URL não definida. Usando a URL padrão: ${URL}" # Mensagem de depuração
fi

# Iniciar Google Chrome
DISPLAY=:0 google-chrome --no-sandbox --disable-gpu --disable-software-rasterizer --disable-dev-shm-usage --use-gl=egl --start-fullscreen --force-device-scale-factor=1.0 --no-first-run --incognito --disable-features=TranslateUI "${URL}" &

# Aguardar o encerramento
wait
