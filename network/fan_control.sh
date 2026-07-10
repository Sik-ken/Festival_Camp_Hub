#!/bin/bash
# Aktive Lüftersteuerung mit Mindestdrehzahl (~30%) statt komplettem
# Abschalten im Leerlauf. Der Kernel-Governor "step_wise" schaltet den
# PWM-Lüfter unter dem ersten Trip-Punkt (60°C) ganz ab und hat nur zwei
# grobe Eskalationsstufen bis 100°C — bei schnellerem Temperaturanstieg
# (z. B. warme Umgebung) kann das zu spät reagieren. Dieses Skript
# übernimmt die Regelung selbst (thermal_zone0 = user_space, damit der
# Kernel nicht parallel gegensteuert) mit feinerer Rampe und einer
# hörbaren Mindestdrehzahl, die immer mitläuft.
set -u

TEMP_FILE=/sys/class/thermal/thermal_zone0/temp
PWM_FILE=/sys/class/hwmon/hwmon2/pwm1
POLICY_FILE=/sys/class/thermal/thermal_zone0/policy

# thermal_zone1 (GPU) hat keine Cooling-Devices gebunden und bleibt daher
# unverändert auf step_wise - nur zone0 treibt den Lüfter.
echo user_space > "$POLICY_FILE"

# Temperaturschwellen (°C) -> PWM-Duty (0-255). Unterhalb der ersten
# Schwelle gilt FLOOR als Mindestdrehzahl (~30%).
THRESHOLDS_C=(45 55 65 75 85)
DUTIES=(77 100 140 180 220 255)
FLOOR=77

pwm_for_temp_c() {
  local t="$1" i
  for i in "${!THRESHOLDS_C[@]}"; do
    if (( t < THRESHOLDS_C[i] )); then
      echo "${DUTIES[i]}"
      return
    fi
  done
  echo "${DUTIES[-1]}"
}

while true; do
  temp_milli=$(cat "$TEMP_FILE" 2>/dev/null) || temp_milli=0
  temp_c=$(( temp_milli / 1000 ))
  duty=$(pwm_for_temp_c "$temp_c")
  if (( duty < FLOOR )); then duty=$FLOOR; fi
  echo "$duty" > "$PWM_FILE" 2>/dev/null
  sleep 10
done
