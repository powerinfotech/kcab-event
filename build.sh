#!/bin/bash
set -e

JAR=build/libs/kcab-event-1.0.0.jar
PROFILE=dev

export JAVA_HOME=/app/jdk-21
export PATH=$JAVA_HOME/bin:/home/kcab/.nvm/versions/node/v20.20.2/bin:$PATH

echo "============================================"
echo "🚀 kcab-event 배포 시작 ($(date '+%Y-%m-%d %H:%M:%S'))"
echo "============================================"
java -version

echo "[1/3] bootJar 빌드..."
chmod +x ./gradlew
./gradlew bootJar --no-daemon

if [ ! -f "$JAR" ]; then
  echo "❌ JAR 빌드 실패: $JAR"
  exit 1
fi

echo "[2/3] 기존 프로세스 종료..."
pkill -f kcab-event-1.0.0.jar || true
for i in $(seq 1 10); do
  pgrep -f kcab-event-1.0.0.jar > /dev/null || break
  sleep 1
done
pkill -9 -f kcab-event-1.0.0.jar || true

echo "[3/3] 새 프로세스 시작 (profile=$PROFILE)..."
mkdir -p logs
LOG=logs/app_$(date '+%Y%m%d_%H%M%S').log
setsid -f java -jar \
  -Dfile.encoding=UTF-8 \
  -Dspring.profiles.active=$PROFILE \
  "$JAR" > "$LOG" 2>&1 < /dev/null
echo "✅ 배포 완료. 로그: $(pwd)/$LOG"
