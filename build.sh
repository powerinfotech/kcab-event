#!/bin/bash
set -e

JAR=build/libs/kcab-event-1.0.0.jar

export JAVA_HOME=/app/jdk-21
export PATH=$JAVA_HOME/bin:/home/kcab/.nvm/versions/node/v20.20.2/bin:$PATH

echo "============================================"
echo "🚀 kcab-event 배포 시작 ($(date '+%Y-%m-%d %H:%M:%S'))"
echo "============================================"
java -version

echo "[1/2] bootJar 빌드..."
chmod +x ./gradlew
./gradlew bootJar --no-daemon

if [ ! -f "$JAR" ]; then
  echo "❌ JAR 빌드 실패: $JAR"
  exit 1
fi

echo "[2/2] kcab-event 서비스 재시작..."
mkdir -p logs
sudo systemctl restart kcab-event
sudo systemctl is-active kcab-event
echo "✅ 배포 완료"
