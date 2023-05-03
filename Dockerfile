FROM ubuntu:latest

# Atualizar repositórios e instalar pacotes necessários
RUN apt-get update && \
     apt-get install -y --no-install-recommends \
     curl \
     gnupg \
     ca-certificates

# Add Google Chrome repository and update repositories
RUN curl -sSL https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
     echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
     apt-get update

# Install necessary packages
RUN apt-get install -y --no-install-recommends \
    wget \
    unzip \
    xvfb \
    x11vnc \
    openbox \
    menu \
    python3 \
    python3-numpy \
    python3-pip \
    google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# Configurar noVNC
RUN mkdir -p /opt/novnc && \
    wget -qO- https://github.com/novnc/noVNC/archive/v1.2.0.tar.gz | tar xz --strip 1 -C /opt/novnc && \
    mkdir -p /opt/novnc/utils/websockify && \
    wget -qO- https://github.com/novnc/websockify/archive/v0.10.0.tar.gz | tar xz --strip 1 -C /opt/novnc/utils/websockify && \
    chmod +x -v /opt/novnc/utils/*.sh && \
    ln -s /opt/novnc/vnc.html /opt/novnc/index.html

# Configurar Openbox
RUN mkdir -p /etc/xdg/openbox && \
    echo '<?xml version="1.0" encoding="UTF-8"?>' > /etc/xdg/openbox/menu.xml && \
    echo '<openbox_menu xmlns="http://openbox.org/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://openbox.org/ file:///usr/share/openbox/menu.xsd">' >> /etc/xdg/openbox/menu.xml && \
    echo '<menu id="root-menu" label="Openbox 3">' >> /etc/xdg/openbox/menu.xml && \
    echo '</menu>' >> /etc/xdg/openbox/menu.xml && \
    echo '</openbox_menu>' >> /etc/xdg/openbox/menu.xml

# Iniciar noVNC, Xvfb, x11vnc e Google Chrome
COPY startup.sh /
RUN chmod +x /startup.sh

EXPOSE 8080
CMD ["/startup.sh"]
